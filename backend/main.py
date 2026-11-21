import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware

# Resilient dual-imports for root and backend/ execution
try:
    from backend.schemas import (
        ExifSummary,
        ForensicAuditResponse,
        HealthResponse,
        VisualForensics,
    )
    from backend.forensics import (
        compute_tampering_likelihood,
        extract_exif_metadata,
        extract_url_text,
        generate_ela_heatmap,
    )
    from backend.analyzer import analyze_content
except ImportError:
    from schemas import (  # type: ignore
        ExifSummary,
        ForensicAuditResponse,
        HealthResponse,
        VisualForensics,
    )
    from forensics import (  # type: ignore
        compute_tampering_likelihood,
        extract_exif_metadata,
        extract_url_text,
        generate_ela_heatmap,
    )
    from analyzer import analyze_content  # type: ignore

# Load environment variables
load_dotenv()

app = FastAPI(
    title="SatyaLens Forensic Engine API",
    description="Real-Time Fact-Verification & Deepfake Media Audit Engine",
    version="1.0.0",
)

# Configure CORS for frontend access (Vercel client & local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check() -> HealthResponse:
    """Forensic engine health status endpoint."""
    return HealthResponse(status="ok", service="satyalens-forensics")


@app.post(
    "/api/analyze",
    response_model=ForensicAuditResponse,
    tags=["Forensics"],
    summary="Multi-modal forensic analysis endpoint (Text, URL, Image)",
)
def analyze_claim(
    text: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None),  # Reserved for P1 stretch
) -> ForensicAuditResponse:
    """
    Analyzes submitted claims, URLs, or images for disinformation, manipulation,
    and media tampering.
    """
    # Normalize inputs whether called via FastAPI HTTP or direct Python invocation
    clean_text = text.strip() if isinstance(text, str) and text.strip() else None
    clean_url = url.strip() if isinstance(url, str) and url.strip() else None

    # Process image if provided
    image_bytes: Optional[bytes] = None
    if image and hasattr(image, "filename") and image.filename:
        try:
            if hasattr(image, "file"):
                image_bytes = image.file.read()
            elif hasattr(image, "read"):
                # Fallback for mock or custom file objects
                res = image.read()
                image_bytes = res if isinstance(res, bytes) else None
            if not image_bytes:
                image_bytes = None
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to read uploaded image: {e}",
            )

    # Process audio if provided (P1 Voice Note Analysis)
    audio_bytes: Optional[bytes] = None
    audio_mime_type: Optional[str] = None
    if audio and hasattr(audio, "filename") and audio.filename:
        valid_audio_exts = (".mp3", ".wav", ".ogg", ".m4a", ".aac", ".webm", ".flac", ".opus", ".mp4")
        if not any(audio.filename.lower().endswith(ext) for ext in valid_audio_exts):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported audio format: {audio.filename}. Allowed formats: MP3, WAV, OGG, M4A, AAC, WEBM, FLAC.",
            )
        try:
            if hasattr(audio, "file"):
                audio_bytes = audio.file.read()
            elif hasattr(audio, "read"):
                res = audio.read()
                audio_bytes = res if isinstance(res, bytes) else None
            if not audio_bytes or len(audio_bytes) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Uploaded audio file is empty.",
                )
            if len(audio_bytes) > 25 * 1024 * 1024:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Audio file exceeds maximum allowable size of 25MB.",
                )
            audio_mime_type = getattr(audio, "content_type", None) or "audio/mp3"
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to read uploaded audio: {e}",
            )

    # 400 Bad Request if no valid input is supplied
    if not clean_text and not clean_url and not image_bytes and not audio_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid input provided. Please provide text, a URL, an image file, or an audio voice note.",
        )

    # Extract URL content if provided
    extracted_url_text: Optional[str] = None
    if clean_url:
        try:
            extracted_url_text = extract_url_text(clean_url)
        except ValueError as e:
            # Enforce strict 400 Bad Request on SSRF or invalid URL schemes
            if "Blocked unsafe or private URL" in str(e) or "empty" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"URL security violation: {e}",
                )
            # If external fetch failed (e.g. offline sandbox or bot protection), fallback gracefully
            extracted_url_text = f"Target URL {clean_url} (Full page scrape unavailable, verifying via search presence)."

    # Compute deterministic visual forensics if image was submitted
    if image_bytes:
        try:
            ela_heatmap = generate_ela_heatmap(image_bytes)
            exif_dict = extract_exif_metadata(image_bytes)
            tampering_likelihood = compute_tampering_likelihood(image_bytes, exif_dict)

            visual_forensics = VisualForensics(
                has_image=True,
                ela_heatmap_base64=ela_heatmap,
                tampering_likelihood=tampering_likelihood,  # type: ignore
                exif_summary=ExifSummary(
                    software=exif_dict.get("software"),
                    camera_model=exif_dict.get("camera_model"),
                    anomalies=exif_dict.get("anomalies", []),
                ),
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image forensics failed: {e}",
            )
    else:
        visual_forensics = VisualForensics(
            has_image=False,
            ela_heatmap_base64=None,
            tampering_likelihood="None",
            exif_summary=ExifSummary(),
        )

    # Run analysis pipeline (Gemini Grounded -> Groq+DDGS -> Heuristics)
    report = analyze_content(
        text=clean_text,
        url=clean_url,
        extracted_url_text=extracted_url_text,
        visual_forensics=visual_forensics,
        audio_bytes=audio_bytes,
        audio_mime_type=audio_mime_type,
    )

    return report


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    app_target = "main:app" if os.path.exists("main.py") else "backend.main:app"
    uvicorn.run(app_target, host=host, port=port, reload=True)
