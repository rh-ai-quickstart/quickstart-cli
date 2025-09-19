import { ConfigTemplateParams } from './index.js';

export const generateGitignore = (params: ConfigTemplateParams): string => {
  // Note: params is included for consistency with other template functions
  // but is not currently used for gitignore generation
  return `# Dependencies
node_modules/
*.pnp
.pnp.js

# Production builds
dist/
build/
lib/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
pnpm-debug.log*
*.log

# OS generated files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Turbo
.turbo/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
env.bak/
venv.bak/

# Testing
.coverage
.pytest_cache/
.vitest/

# Database
*.db
*.sqlite
`;
};
