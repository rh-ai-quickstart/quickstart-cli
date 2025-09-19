import { ConfigTemplateParams } from '.';

export const generateDockerCompose = (params: ConfigTemplateParams): string => {
  const { config } = params;
  return `services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: ${config.name}
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d ${config.name}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
`;
};