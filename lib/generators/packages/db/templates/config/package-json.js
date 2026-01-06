import { normalizeServiceName } from '../../../../utils/name-normalize.js';
export const generatePackageJson = (params) => {
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
${config.packageManager} upgrade && podman-compose -f ../../compose.yml logs -f ${serviceName}`;
    return JSON.stringify({
        name: `@${config.name}/db`,
        private: true,
        version: '0.0.0',
        scripts: {
            dev: devScript,
            'db:start': `podman-compose -f ../../compose.yml up -d ${serviceName}`,
            'db:stop': `podman-compose -f ../../compose.yml down ${serviceName}`,
            'db:logs': `podman-compose -f ../../compose.yml logs -f ${serviceName}`,
            upgrade: 'alembic upgrade head',
            downgrade: 'alembic downgrade -1',
            revision: 'alembic revision --autogenerate',
            history: 'alembic history',
            current: 'alembic current',
            'install:deps': 'python -m pip install -e ".[dev]"',
        },
    }, null, 2);
};
