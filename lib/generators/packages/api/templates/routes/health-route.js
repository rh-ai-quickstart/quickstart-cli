export const generateHealthRoute = (params) => {
    const { config } = params;
    const baseImports = `from fastapi import APIRouter
from ..schemas.health import HealthResponse
from datetime import datetime, timezone

# Capture API service startup time
API_START_TIME = datetime.now(timezone.utc)`;
    const dbImports = config.features.db
        ? `from fastapi import Depends
from typing import Optional
try:
    from db import DatabaseService, get_db_service  # type: ignore[import-untyped]
except Exception:
    # DB package not available or untyped
    DatabaseService = None  # type: ignore[assignment]
    get_db_service = None  # type: ignore[assignment]`
        : '';
    const healthSignature = config.features.db
        ? `async def health_check(
    db_service: Optional[DatabaseService] = Depends(get_db_service) if get_db_service else None
) -> list[HealthResponse]:`
        : `async def health_check() -> list[HealthResponse]:`;
    const healthLogic = config.features.db
        ? `    """Health check endpoint with dependency injection"""
    api_response = HealthResponse(
        name="API",
        status="healthy",
        message="API is running",
        version="0.0.0",
        start_time=API_START_TIME.isoformat()
    )
    
    # Get database health using dependency injection
    responses = [api_response]
    if db_service:
        db_health = await db_service.health_check()
        db_response = HealthResponse(**db_health)
        responses.append(db_response)
    
    return responses`
        : `    """Health check endpoint"""
    api_response = HealthResponse(
        name="API",
        status="healthy",
        message="API is running",
        version="0.0.0",
        start_time=API_START_TIME.isoformat()
    )
    
    return [api_response]`;
    return /* python */ `"""
Health check endpoints
"""

${baseImports}
${dbImports}

router = APIRouter()


@router.get("/", response_model=list[HealthResponse])
${healthSignature}
${healthLogic}
`;
};
