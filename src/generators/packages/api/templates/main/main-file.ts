import { SourceTemplateParams } from '.';

export const generateMainFile = (params: SourceTemplateParams): string => {
  const { config } = params;
  const title = `${config.name} API`;
  const description = config.description || `API for ${config.name}`;
  const welcomeMessage = `Welcome to ${config.name} API`;

  return /* python */ `"""
FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import health
from .core.config import settings

app = FastAPI(
    title="${title}",
    description="${description}",
    version="0.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])

@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint"""
    return {"message": "${welcomeMessage}"}
`;
};
