export const generatePackageJson = (params) => {
    const { config } = params;
    return JSON.stringify({
        name: `@${config.name}/db`,
        private: true,
        version: '0.0.0',
        scripts: {
            dev: 'pnpm db:start && pnpm upgrade && pnpm db:logs; EXIT_CODE=$?; pnpm db:stop && exit $EXIT_CODE',
            'db:start': 'docker compose up -d',
            'db:stop': 'docker compose down',
            'db:logs': 'docker compose logs -f postgres',
            upgrade: 'alembic upgrade head',
            downgrade: 'alembic downgrade -1',
            revision: 'alembic revision --autogenerate',
            history: 'alembic history',
            current: 'alembic current',
            'install:deps': 'python -m pip install -e ".[dev]"',
        },
    }, null, 2);
};
