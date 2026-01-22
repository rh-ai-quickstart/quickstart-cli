import { ConfigTemplateParams } from '.';
import { normalizeServiceName } from '../../../../utils/name-normalize.js';

export const generatePackageJson = (params: ConfigTemplateParams): string => {
  const { config } = params;
  const serviceName = normalizeServiceName(config.name, 'db');
  
  // Dev script that checks if container is running, starts it if needed, and stops it on exit only if we started it
  const devScript = `CONTAINER_STARTED=0; \\
if ! podman-compose -f ../../compose.yml ps ${serviceName} 2>/dev/null | grep -q "Up"; then \\
  echo "Starting database container..."; \\
  podman-compose -f ../../compose.yml up -d ${serviceName}; \\
  CONTAINER_STARTED=1; \\
else \\
  echo "Database container is already running"; \\
fi; \\
cleanup() { \\
  if [ "$$CONTAINER_STARTED" = "1" ]; then \\
    echo "Stopping database container..."; \\
    podman-compose -f ../../compose.yml down ${serviceName}; \\
  fi; \\
}; \\
trap cleanup EXIT INT TERM; \\
${config.packageManager} migrate && podman-compose -f ../../compose.yml logs -f ${serviceName}`;
  
  return JSON.stringify(
    {
      name: `@${config.name}/db`,
      private: true,
      version: '0.0.0',
      scripts: {
        dev: devScript,
        'db:start': `podman-compose -f ../../compose.yml up -d ${serviceName}`,
        'db:stop': `podman-compose -f ../../compose.yml down ${serviceName}`,
        'db:logs': `podman-compose -f ../../compose.yml logs -f ${serviceName}`,
        migrate: 'uv run alembic upgrade head',
        'migrate:down': 'uv run alembic downgrade -1',
        'migrate:new': 'uv run alembic revision --autogenerate',
        'migrate:history': 'uv run alembic history',
        'migrate:current': 'uv run alembic current',
        'install:deps': 'uv sync',
      },
    },
    null,
    2
  );
};
