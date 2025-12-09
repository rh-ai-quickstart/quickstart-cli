import { ConfigTemplateParams } from '.';

export const generatePackageJson = (params: ConfigTemplateParams): string => {
  const { config } = params;
  const installDepsScript = config.features.db
    ? 'uv sync && uv pip install -e ../db'
    : 'uv sync';

  // Note: Database container is managed by the DB package, not here
  // The API just runs - it assumes the DB package will start the database
  const devScript = 'uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000';

  return JSON.stringify(
    {
      name: `@${config.name}/api`,
      private: true,
      version: '0.0.0',
      description: 'FastAPI backend application',
      scripts: {
        'install:deps': installDepsScript,
        dev: devScript,
        start: 'uv run uvicorn src.main:app --host 0.0.0.0 --port 8000',
        test: 'uv run pytest',
        lint: 'uv run ruff check .',
        'lint:fix': 'uv run ruff check . --fix',
        format: 'uv run ruff format .',
        'format:check': 'uv run ruff format . --check',
        'type-check': 'uv run mypy src/',
      },
    },
    null,
    2
  );
};