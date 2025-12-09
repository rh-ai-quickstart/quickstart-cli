# Package Version Management

This document explains how package versions are managed in the AI QuickStart CLI.

## Overview

All package versions used in generated projects are centralized in `src/generators/versions.ts`. This ensures:

- **Single source of truth**: Update versions in one place
- **Consistency**: All generated projects use the same versions
- **Maintainability**: Easy to track and update dependencies
- **Compatibility**: Documented version conflicts and requirements

## Version Strategy

### Version Ranges

- **Exact versions** (e.g., `'0.25.12'`): Used for critical dependencies to avoid conflicts
  - Example: `esbuild` is pinned to avoid conflicts between vite and storybook
- **Caret ranges** (e.g., `'^5.2.0'`): Used for most dependencies to allow patch/minor updates
  - Allows automatic updates for bug fixes and minor features
- **Greater-than-or-equal** (e.g., `'>=2.5.0'`): Used for Python packages
  - Follows Python packaging conventions

### Version Categories

Versions are organized into logical groups:

- **PACKAGE_MANAGER_VERSIONS**: pnpm, yarn, npm versions
- **CORE_VERSIONS**: Monorepo tooling (turbo, husky, etc.)
- **REACT_VERSIONS**: React and React types
- **BUILD_VERSIONS**: Vite, TypeScript, esbuild
- **TESTING_VERSIONS**: Vitest, testing libraries
- **STORYBOOK_VERSIONS**: Storybook and addons
- **ROUTING_VERSIONS**: TanStack Router and Query
- **UI_COMPONENT_VERSIONS**: Radix UI, Tailwind, etc.
- **STYLING_VERSIONS**: Tailwind CSS, PostCSS
- **LINTING_VERSIONS**: ESLint, Prettier
- **PYTHON_VERSIONS**: FastAPI, Pydantic, SQLAlchemy, etc.

## Updating Versions

### To Update a Version

1. Open `src/generators/versions.ts`
2. Find the version constant in the appropriate category
3. Update the version string
4. Rebuild the project: `pnpm build`
5. Test by generating a new project

### Example: Updating React

```typescript
// In src/generators/versions.ts
export const REACT_VERSIONS = {
  react: '^18.3.0',  // Changed from ^18.2.0
  'react-dom': '^18.3.0',
  // ...
} as const;
```

### Example: Updating Python Packages

```typescript
// In src/generators/versions.ts
export const PYTHON_VERSIONS = {
  fastapi: '>=0.105.0',  // Changed from >=0.104.0
  // ...
} as const;
```

## Compatibility Notes

The version file includes compatibility notes for known conflicts:

```typescript
/**
 * Build Tool Versions
 * 
 * Compatibility Notes:
 * - Vite 5.2.0 requires esbuild ^0.20.1
 * - Storybook 8.1.1 requires esbuild 0.25.12
 * - esbuild is pinned to 0.25.12 to avoid conflicts
 */
export const BUILD_VERSIONS = {
  vite: '^5.2.0',
  esbuild: '0.25.12',  // Pinned to avoid conflicts
  // ...
} as const;
```

## Using Versions in Templates

Templates import and use version constants:

```typescript
import { UI_VERSIONS, STORYBOOK_VERSIONS } from '../../../../versions.js';

const devDependencies = {
  ...UI_VERSIONS,
  ...STORYBOOK_VERSIONS,
};
```

### Python Templates

Python templates format versions with `>=` prefix:

```typescript
import { PYTHON_VERSIONS } from '../../../../versions.js';

const formatPythonVersion = (version: string): string => {
  const cleanVersion = version.replace(/^>=/, '');
  return `>=${cleanVersion}`;
};

// Usage in TOML template
`"fastapi${formatPythonVersion(PYTHON_VERSIONS.fastapi)}"`
```

## Best Practices

1. **Test after updates**: Always test version updates by generating a new project
2. **Document conflicts**: Add compatibility notes when pinning versions
3. **Group related versions**: Keep related packages in the same category
4. **Use exact versions sparingly**: Only pin when necessary to avoid conflicts
5. **Update regularly**: Keep dependencies up-to-date for security and features

## Version Update Checklist

When updating versions:

- [ ] Update version in `src/generators/versions.ts`
- [ ] Add compatibility notes if pinning a version
- [ ] Rebuild: `pnpm build`
- [ ] Generate test project: `node lib/quickstart-cli.js create test-project`
- [ ] Verify installation succeeds: `cd test-project && pnpm install`
- [ ] Test build: `pnpm build`
- [ ] Test dev server: `pnpm dev` (if applicable)
- [ ] Update this documentation if adding new categories

## Troubleshooting

### Version Conflicts

If you encounter version conflicts:

1. Check compatibility notes in `versions.ts`
2. Use `pnpm why <package>` to see dependency tree
3. Consider pinning the conflicting package to an exact version
4. Document the conflict in compatibility notes

### Build Errors After Version Update

1. Check TypeScript compilation: `pnpm build`
2. Verify imports are correct (relative paths)
3. Ensure version format matches expected type (string vs number)
4. Check if template syntax needs updating for new version format

## Related Files

- `src/generators/versions.ts` - Centralized version definitions
- `src/generators/packages/*/templates/config/package-json.ts` - Node.js templates
- `src/generators/packages/*/templates/config/pyproject-toml.ts` - Python templates

