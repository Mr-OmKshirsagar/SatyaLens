from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "satyalens-forensics"


class SourceCitation(BaseModel):
    title: str = Field(..., description="Source title or domain")
    url: str = Field(..., description="Direct URL of the corroborating/debunking source")


class AtomicClaim(BaseModel):
    claim: str = Field(..., description="Individual extracted factual claim")
    status: Literal["Verified", "Misleading", "Fabricated", "Unverified"] = Field(
        ..., description="Verification status of this specific claim"
    )
    explanation: str = Field(..., description="Brief factual explanation or debunker context")
    sources: List[SourceCitation] = Field(
        default_factory=list, description="Grounding citations for this claim"
    )


class ExifSummary(BaseModel):
    software: Optional[str] = Field(None, description="Software or editing tool detected in metadata")
    camera_model: Optional[str] = Field(None, description="Camera make/model if present")
    anomalies: List[str] = Field(
        default_factory=list, description="Suspicious or missing EXIF tags"
    )


class VisualForensics(BaseModel):
    has_image: bool = Field(False, description="Whether an image was provided for forensic audit")
    ela_heatmap_base64: Optional[str] = Field(
        None, description="Base64 JPEG data URI of the Error Level Analysis heatmap"
    )
    tampering_likelihood: Literal["None", "Low", "Medium", "High"] = Field(
        "None", description="Likelihood of visual manipulation"
    )
    exif_summary: ExifSummary = Field(
        default_factory=ExifSummary, description="Metadata and software forensic findings"
    )


class LinguisticFlag(BaseModel):
    trigger: str = Field(..., description="Type of manipulation (e.g., False Urgency, Authority Spoofing)")
    evidence: str = Field(..., description="Quoted snippet or pattern from input text")
    severity: Literal["Low", "Medium", "High"] = Field(
        "Low", description="Severity level of the psychological manipulation trigger"
    )


class ForensicAuditResponse(BaseModel):
    overall_score: int = Field(
        ..., ge=0, le=100, description="Authenticity confidence score from 0 (Fabricated) to 100 (Verified)"
    )
    verdict: Literal["Verified", "Misleading", "Fabricated", "Manipulated Media", "Unverified"] = Field(
        ..., description="Overall forensic verdict"
    )
    provenance_category: str = Field(
        "Claim Check", description="Primary category of the analyzed artifact"
    )
    summary: str = Field(..., description="Executive summary of the forensic audit")
    atomic_claims: List[AtomicClaim] = Field(
        default_factory=list, description="Decomposed atomic claims with verification"
    )
    visual_forensics: VisualForensics = Field(
        default_factory=VisualForensics, description="Image forensics and ELA findings"
    )
    linguistic_flags: List[LinguisticFlag] = Field(
        default_factory=list, description="Detected manipulation and scam indicators"
    )
    whatsapp_card_en: str = Field(
        ..., description="Copy-ready plain text WhatsApp Fact Card in English"
    )
    whatsapp_card_hi: str = Field(
        ..., description="Copy-ready plain text WhatsApp Fact Card in Hindi"
    )
    engine_used: str = Field(
        ..., description="Forensic engine pipeline that produced this report"
    )
