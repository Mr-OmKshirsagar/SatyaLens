"""
SatyaLens Deterministic Forensics Module
Contains Error Level Analysis (ELA) heatmap generation, EXIF metadata extraction,
and SSRF-guarded URL article extraction using trafilatura.
"""

import base64
import io
import ipaddress
import socket
import urllib.parse
import warnings
from typing import Any, Dict, List, Optional

# Suppress urllib3 optional SOCKS dependency warning
warnings.filterwarnings("ignore", module="urllib3")

import numpy as np
from PIL import ExifTags, Image, ImageChops, ImageEnhance
import trafilatura

# Maximum image pixel allowance to prevent decompression bomb attacks
Image.MAX_IMAGE_PIXELS = 25_000_000
MAX_IMAGE_DIMENSION = 2048
MAX_IMAGE_FILE_SIZE = 25 * 1024 * 1024  # 25 MB


def generate_ela_heatmap(image_bytes: bytes) -> str:
    """
    Generates an Error Level Analysis (ELA) heatmap for the given image bytes.
    Re-saves the image at JPEG quality 90, computes the amplified pixel difference
    between the original and re-saved versions, and returns a base64 JPEG data URI.

    Args:
        image_bytes: Raw bytes of the uploaded image.

    Returns:
        A data URI string: 'data:image/jpeg;base64,...'

    Raises:
        ValueError: If image_bytes is empty, exceeds size limits, or is corrupted.
    """
    if not image_bytes:
        raise ValueError("Image data is empty.")

    if len(image_bytes) > MAX_IMAGE_FILE_SIZE:
        raise ValueError(f"Image exceeds maximum allowable size of {MAX_IMAGE_FILE_SIZE // (1024 * 1024)}MB.")

    try:
        # Verify image integrity first
        verify_img = Image.open(io.BytesIO(image_bytes))
        verify_img.verify()

        # Reopen for actual processing (verify closes/invalidates the stream)
        orig = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Invalid or corrupted image format: {e}") from e

    # Constrain dimensions to prevent high memory usage and latency
    if max(orig.size) > MAX_IMAGE_DIMENSION:
        orig.thumbnail((MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION), Image.Resampling.LANCZOS)

    # Re-save at JPEG quality 90 to simulate standard re-compression
    resaved_buffer = io.BytesIO()
    orig.save(resaved_buffer, format="JPEG", quality=90)
    resaved_buffer.seek(0)
    resaved = Image.open(resaved_buffer).convert("RGB")

    # Compute difference
    diff = ImageChops.difference(orig, resaved)

    # Determine amplification scale based on maximum error level
    extrema = diff.getextrema()  # Tuple of (min, max) for each channel R, G, B
    max_diff = max(ex[1] for ex in extrema) if extrema else 0

    if max_diff > 0:
        # Forensic scale: amplify differences up to 15x or stretch to max contrast
        scale = min(255.0 / max_diff, 15.0)
    else:
        scale = 1.0

    enhanced = ImageEnhance.Brightness(diff).enhance(scale)

    # Export amplified heatmap to base64 JPEG
    out_buffer = io.BytesIO()
    enhanced.save(out_buffer, format="JPEG", quality=90)
    b64_str = base64.b64encode(out_buffer.getvalue()).decode("utf-8")

    return f"data:image/jpeg;base64,{b64_str}"


def extract_exif_metadata(image_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts camera hardware, editing software, and anomaly indicators from EXIF tags.

    Args:
        image_bytes: Raw bytes of the uploaded image.

    Returns:
        dict matching ExifSummary schema:
        {
            "software": Optional[str],
            "camera_model": Optional[str],
            "anomalies": List[str]
        }
    """
    result: Dict[str, Any] = {
        "software": None,
        "camera_model": None,
        "anomalies": [],
    }

    if not image_bytes:
        result["anomalies"].append("Empty image data provided.")
        return result

    try:
        img = Image.open(io.BytesIO(image_bytes))
        exif = img.getexif()
        if not exif:
            result["anomalies"].append("No EXIF metadata present (common for web uploads, social media re-encodings, or screenshots).")
            return result

        # Map tag IDs to human-readable tag names
        tag_dict: Dict[str, Any] = {}
        for tag_id, value in exif.items():
            tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
            tag_dict[tag_name] = value

        # Check secondary IFDs (ExifIFD, GPSInfo)
        try:
            for ifd_id in (ExifTags.IFD.Exif, ExifTags.IFD.GPSInfo):
                try:
                    ifd = exif.get_ifd(ifd_id)
                    for k, v in ifd.items():
                        name = ExifTags.TAGS.get(k, str(k))
                        if name not in tag_dict:
                            tag_dict[name] = v
                except Exception:
                    pass
        except Exception:
            pass

        # Extract Make and Model
        make = str(tag_dict.get("Make", "")).strip()
        model = str(tag_dict.get("Model", "")).strip()
        if make or model:
            if make and model:
                if make.lower() in model.lower():
                    camera_model = model
                else:
                    camera_model = f"{make} {model}"
            else:
                camera_model = make or model
            result["camera_model"] = camera_model

        # Extract Software / Editor metadata
        software = tag_dict.get("Software")
        if software:
            software_str = str(software).strip()
            result["software"] = software_str

            # Flag suspicious editing or generative software signatures
            known_manipulation_keywords = [
                "photoshop", "gimp", "canva", "lightroom", "procreate",
                "snapseed", "picsart", "fotor", "midjourney", "stable diffusion",
                "dall-e", "comfyui", "automatic1111", "firefly"
            ]
            software_lower = software_str.lower()
            if any(keyword in software_lower for keyword in known_manipulation_keywords):
                result["anomalies"].append(f"Editing software signature detected: {software_str}")

        # Anomaly rules
        if result["software"] and not result["camera_model"]:
            result["anomalies"].append("Software signature found without camera hardware details (suggests digital synthesis or template export).")

        if not result["software"] and not result["camera_model"] and len(tag_dict) <= 2:
            result["anomalies"].append("Minimal EXIF tags found; metadata may have been partially sanitized.")

        return result
    except Exception as e:
        result["anomalies"].append(f"EXIF parsing error: {e}")
        return result


def compute_tampering_likelihood(image_bytes: bytes, exif_info: Optional[Dict[str, Any]] = None) -> str:
    """
    Estimates visual tampering likelihood ('None', 'Low', 'Medium', 'High')
    by evaluating ELA pixel-error variance and EXIF software anomalies.
    """
    try:
        orig = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        if max(orig.size) > 1024:
            orig.thumbnail((1024, 1024), Image.Resampling.BILINEAR)

        resaved_buffer = io.BytesIO()
        orig.save(resaved_buffer, format="JPEG", quality=90)
        resaved_buffer.seek(0)
        resaved = Image.open(resaved_buffer).convert("RGB")

        orig_arr = np.asarray(orig, dtype=np.float32)
        resaved_arr = np.asarray(resaved, dtype=np.float32)
        diff_arr = np.abs(orig_arr - resaved_arr)

        # High variance in error levels across the image suggests composite/tampered elements
        diff_std = float(np.std(diff_arr))
        diff_99th = float(np.percentile(diff_arr, 99))

        # Check for software indicators in EXIF
        has_editing_software = False
        if exif_info and exif_info.get("software"):
            sw_lower = str(exif_info["software"]).lower()
            if any(k in sw_lower for k in ["photoshop", "gimp", "canva", "midjourney", "stable diffusion"]):
                has_editing_software = True

        if has_editing_software and (diff_std > 8.0 or diff_99th > 30.0):
            return "High"
        if has_editing_software or diff_std > 7.0 or diff_99th > 25.0:
            return "Medium"
        if diff_std > 4.0 or diff_99th > 15.0:
            return "Low"
        return "Low"
    except Exception:
        return "None"


def is_safe_url(url: str) -> bool:
    """
    SSRF guard: Validates URL protocol and verifies the destination IP address
    is not private, loopback, link-local, multicast, or cloud metadata.

    Args:
        url: The candidate URL string.

    Returns:
        True if safe to fetch, False otherwise.
    """
    try:
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False

        hostname = parsed.hostname
        if not hostname:
            return False

        lower_host = hostname.lower()
        # Direct string blocklist for local/internal names
        if (
            lower_host in ("localhost", "127.0.0.1", "::1", "0.0.0.0")
            or lower_host.endswith(".local")
            or lower_host.endswith(".internal")
            or lower_host.endswith(".localhost")
            or lower_host.endswith(".lan")
        ):
            return False

        # If hostname is an IP literal, evaluate directly
        try:
            ip = ipaddress.ip_address(lower_host)
            if (
                ip.is_private
                or ip.is_loopback
                or ip.is_link_local
                or ip.is_reserved
                or ip.is_multicast
                or str(ip) in ("169.254.169.254", "fd00:ec2::254")
            ):
                return False
            return True
        except ValueError:
            # Not an IP literal, continue to DNS / FQDN checks
            pass

        # Try resolving host addresses to check against private IP ranges
        try:
            addr_infos = socket.getaddrinfo(hostname, None)
            for _, _, _, _, sockaddr in addr_infos:
                ip_str = sockaddr[0]
                ip = ipaddress.ip_address(ip_str)
                if (
                    ip.is_private
                    or ip.is_loopback
                    or ip.is_link_local
                    or ip.is_reserved
                    or ip.is_multicast
                    or ip_str in ("169.254.169.254", "fd00:ec2::254")
                ):
                    return False
        except socket.gaierror:
            # When offline/sandboxed, DNS resolution may fail. Validate domain structure
            if "." not in lower_host or lower_host.startswith(".") or lower_host.endswith("."):
                return False
            local_tlds = (".local", ".lan", ".internal", ".corp", ".home", ".test", ".invalid", ".example")
            if any(lower_host.endswith(tld) for tld in local_tlds):
                return False

        return True
    except Exception:
        return False


def extract_url_text(url: str) -> str:
    """
    Safely retrieves and extracts clean article body text from an external web URL
    using trafilatura, enforcing strict SSRF protections.

    Args:
        url: The target web URL.

    Returns:
        Cleaned plain text of the article.

    Raises:
        ValueError: If URL is invalid, target is unsafe (SSRF), or content cannot be parsed.
    """
    clean_url = url.strip()
    if not clean_url:
        raise ValueError("URL cannot be empty.")

    if not is_safe_url(clean_url):
        raise ValueError(f"Blocked unsafe or private URL target: {clean_url}")

    try:
        downloaded = trafilatura.fetch_url(clean_url)
    except Exception as e:
        raise ValueError(f"Failed to fetch content from {clean_url}: {e}") from e

    if not downloaded:
        raise ValueError(f"No content retrieved from URL: {clean_url}")

    extracted_text = trafilatura.extract(
        downloaded,
        include_comments=False,
        include_tables=False,
        favor_recall=True,
    )

    if not extracted_text or not extracted_text.strip():
        raise ValueError(f"No readable article text could be extracted from {clean_url}.")

    return extracted_text.strip()
