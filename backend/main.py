import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    from backend.schemas import HealthResponse
except ImportError:
    from schemas import HealthResponse

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


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    app_target = "main:app" if os.path.exists("main.py") else "backend.main:app"
    uvicorn.run(app_target, host=host, port=port, reload=True)
