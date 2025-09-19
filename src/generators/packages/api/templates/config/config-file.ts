import { SourceTemplateParams } from '../main';

export const generateConfigFile = (params: SourceTemplateParams): string => {
  const { config } = params;
  const dbSettings = config.features.db
    ? `    # Database settings
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/${config.name}"
    `
    : '';

  return `"""
Application configuration
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Basic settings
    APP_NAME: str = "${config.name}"
    DEBUG: bool = False
    
    # CORS settings
    ALLOWED_HOSTS: list[str] = ["http://localhost:5173"]
    
${dbSettings}
    class Config:
        env_file = ".env"


settings = Settings()
`;
};
