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
    Re-saves the image at JPEG quality 90, computes non-linear gamma-amplified
    pixel differences with localized anomaly boosting, and returns a base64 JPEG data URI.

    Ensures localized modifications (e.g., mosaic pixelation, brush strokes, spliced
    foreign elements) are visually prominent even when whole-image error averages are low.

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

    # Compute per-pixel difference array
    orig_arr = np.asarray(orig, dtype=np.float32)
    resaved_arr = np.asarray(resaved, dtype=np.float32)
    diff_arr = np.abs(orig_arr - resaved_arr)

    # Per-pixel max error across R, G, B channels
    error_mag = np.max(diff_arr, axis=2)
    p99_5 = float(np.percentile(error_mag, 99.5))
    norm_max = max(p99_5, 6.0)

    # Non-linear gamma amplification: expands subtle local block error into clear visibility
    normalized = np.clip(diff_arr / norm_max, 0.0, 1.0)
    amplified = np.power(normalized, 0.7) * 255.0

    # Local anomaly boost: highlight regions with error elevated above background median
    med_error = float(np.median(error_mag))
    anomaly_mask = error_mag > max(med_error * 2.5, 4.0)

    highlighted = amplified.copy()
    if np.any(anomaly_mask):
        highlighted[anomaly_mask] = np.clip(amplified[anomaly_mask] * 1.35 + 25.0, 0, 255)

    enhanced = Image.fromarray(np.clip(highlighted, 0, 255).astype(np.uint8))

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
            # Missing EXIF is standard on social media / WhatsApp / web uploads; treat as neutral, not a tampering anomaly.
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
                "dall-e", "comfyui", "automatic1111", "firefly",
                "android gallery", "gallery", "samsung gallery", "samsung editor",
                "google photos", "apple photos", "photo editor", "pixlr",
                "vsco", "facetune", "remini", "meitu", "inshot",
            ]
            software_lower = software_str.lower()
            if any(keyword in software_lower for keyword in known_manipulation_keywords):
                result["anomalies"].append(f"Editing software signature detected: {software_str}")

        # Anomaly rules (only flag genuine software mismatches)
        if result["software"] and not result["camera_model"]:
            result["anomalies"].append("Software signature found without camera hardware details (suggests digital synthesis or template export).")

        return result
    except Exception as e:
        result["anomalies"].append(f"EXIF parsing error: {e}")
        return result


def compute_tampering_likelihood(
    image_bytes: bytes,
    exif_info: Optional[Dict[str, Any]] = None,
    return_metrics: bool = False,
) -> Any:
    """
    Estimates visual tampering likelihood ('None', 'Low', 'Medium', 'High')
    by evaluating multi-scale local patch ELA variance, sharp boundary gradient detection,
    and EXIF software/hardware anomaly indicators.

    Detects localized modifications (such as mosaic blocks, brush strokes, and spliced
    foreign elements) even when EXIF metadata has been completely stripped.

    Args:
        image_bytes: Raw bytes of the uploaded image.
        exif_info: Optional parsed EXIF summary dictionary.
        return_metrics: If True, returns a tuple (verdict, metrics_dict).
                        If False, returns just the verdict string for backwards compatibility.

    Returns:
        verdict string ("None"|"Low"|"Medium"|"High") or tuple (verdict, metrics_dict).
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
        error_map = np.max(diff_arr, axis=2)

        # 1. Global statistics
        global_mean = float(np.mean(error_map))
        global_std = float(np.std(error_map))
        global_p99 = float(np.percentile(error_map, 99))

        # 2. Local patch-level statistics (16x16 blocks)
        h, w = error_map.shape
        bs = 16
        block_means = []
        block_stds = []
        for y in range(0, h - bs + 1, bs):
            for x in range(0, w - bs + 1, bs):
                patch = error_map[y : y + bs, x : x + bs]
                block_means.append(float(np.mean(patch)))
                block_stds.append(float(np.std(patch)))

        if not block_means:
            fallback_metrics = {"error": "Image too small for block analysis"}
            return ("Low", fallback_metrics) if return_metrics else "Low"

        block_means_arr = np.array(block_means)
        med_block = float(np.median(block_means_arr))
        p99_block = float(np.percentile(block_means_arr, 99))
        max_block = float(np.max(block_means_arr))

        # Outlier block ratio: ratio of peak patch to background median
        # Baseline floor of 0.6 prevents small denominators from artificially inflating ratios on white document space or solid backgrounds
        baseline = max(med_block, 0.6)
        patch_ratio_max = max_block / baseline
        patch_ratio_p99 = p99_block / baseline

        # Outlier count: patches with error significantly exceeding background
        # An absolute minimum threshold of 3.8 ensures normal low-error printed text and borders are not counted as outliers
        outlier_threshold = max(med_block * 3.5, med_block + 3.0 * float(np.std(block_means_arr)), 3.8)
        outlier_count = int(np.sum(block_means_arr > outlier_threshold))
        outlier_pct = float(outlier_count / len(block_means_arr) * 100)

        # 3. Spatial Gradient & Boundary Discontinuity Detection
        gy, gx = np.gradient(error_map)
        grad_mag = np.sqrt(gx**2 + gy**2)
        grad_p99 = float(np.percentile(grad_mag, 99))
        grad_max = float(np.max(grad_mag))

        # 4. Check EXIF software signatures
        has_editing_software = False
        software_detected = None
        if exif_info and exif_info.get("software"):
            sw = str(exif_info["software"]).lower()
            known = [
                "photoshop", "gimp", "canva", "snapseed", "picsart",
                "fotor", "midjourney", "stable diffusion", "lightroom", "procreate",
                "dall-e", "comfyui", "automatic1111", "firefly",
                "android gallery", "gallery", "samsung gallery", "samsung editor",
                "google photos", "apple photos", "photo editor", "pixlr",
                "vsco", "facetune", "remini", "meitu", "inshot",
            ]
            if any(k in sw for k in known):
                has_editing_software = True
                software_detected = exif_info["software"]

        # 5. Composite Multi-Factor Tampering Evaluation
        # Requires substantial absolute error (max_block >= 4.0) so document/text contrast alone is never flagged
        has_critical_patch = (patch_ratio_max >= 12.0 and max_block >= 4.8 and outlier_count >= 2)
        has_moderate_patch = (patch_ratio_max >= 7.5 and max_block >= 4.0 and outlier_count >= 1)
        has_slight_patch = (patch_ratio_max >= 4.0 and max_block >= 3.2 and outlier_count >= 1)

        # Factor B: Sharp boundary transition (edges indicative of splicing/mosaic boundaries)
        # Spliced boundary is only flagged if accompanied by an anomalous high-error patch
        has_sharp_boundary = (grad_max >= 12.0 and max_block >= 4.5 and patch_ratio_max >= 6.0 and outlier_count >= 1)

        # Factor C: Global high variance (e.g. full-canvas composites)
        has_high_global_variance = (global_std > 8.0 or global_p99 > 30.0)
        has_moderate_global_variance = (global_std > 6.0 or global_p99 > 22.0)

        # Explanatory anomaly rationale
        explanatory_anomaly: Optional[str] = None
        if has_critical_patch:
            explanatory_anomaly = (
                f"Localized compression anomaly detected: peak patch error is {patch_ratio_max:.1f}x above "
                f"background baseline ({outlier_pct:.1f}% of blocks show distinct re-compression mismatch)."
            )
        elif has_sharp_boundary:
            explanatory_anomaly = (
                f"Sharp boundary discontinuities detected in error level analysis (grad: {grad_max:.1f}) "
                f"indicating spliced borders or localized pixelation."
            )
        elif has_moderate_patch:
            explanatory_anomaly = (
                f"Moderate localized patch variance detected ({patch_ratio_max:.1f}x baseline error)."
            )
        elif has_editing_software:
            explanatory_anomaly = (
                f"Editing software signature detected in image metadata ({software_detected})."
            )

        metrics = {
            "global_std": round(global_std, 2),
            "global_p99": round(global_p99, 2),
            "median_block_error": round(med_block, 2),
            "max_block_error": round(max_block, 2),
            "patch_ratio_max": round(patch_ratio_max, 2),
            "outlier_blocks_count": outlier_count,
            "outlier_blocks_pct": round(outlier_pct, 2),
            "grad_max": round(grad_max, 2),
            "grad_p99": round(grad_p99, 2),
            "has_editing_software": has_editing_software,
            "explanatory_anomaly": explanatory_anomaly,
        }

        # Classification decision hierarchy
        if has_editing_software and (has_critical_patch or has_high_global_variance or has_sharp_boundary):
            verdict = "High"
        elif has_critical_patch and (has_sharp_boundary or patch_ratio_max >= 20.0 or outlier_count >= 3):
            verdict = "High"
        elif has_high_global_variance and has_moderate_patch:
            verdict = "High"
        elif has_editing_software or has_moderate_patch or has_sharp_boundary or has_moderate_global_variance:
            verdict = "Medium"
        elif has_slight_patch or global_std > 3.5 or global_p99 > 12.0:
            verdict = "Low"
        else:
            verdict = "Low"

        return (verdict, metrics) if return_metrics else verdict

    except Exception as e:
        fallback_metrics = {"error": str(e)}
        return ("None", fallback_metrics) if return_metrics else "None"


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
