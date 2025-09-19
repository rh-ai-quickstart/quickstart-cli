/**
 * UI Package Generator
 * Generates React/Vite/TanStack Router package
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectConfig } from '../../../types/features.js';
import {
  generatePackageJson,
  generateViteConfig,
  generateTSConfig,
  generateTSConfigNode,
  generateGlobalCSS,
  generateStorybookMain,
  generateStorybookPreview,
  generateComponentsJson,
  generateESLintConfig,
  generatePrettierRc,
  ConfigTemplateParams,
} from './templates/config/index.js';
import {
  generateIndexRoute,
  generateRootRoute,
  generateRouteTree,
  RouteTemplateParams,
} from './templates/routes/index.js';
import { generateCnUtil } from './templates/components/index.js';
import { baseDirectories, components as componentDefinitions } from './component-structure.js';
import { generateHealthService } from './templates/services/health.js';
import { generateHealthHook } from './templates/hooks/health.js';
import { generateHealthSchema } from './templates/schemas/health.js';
import { generateIndexHtml, generateMainTsx } from './templates/main/index.js';

export class UIPackageGenerator {
  private packageDir: string;
  private templateParams: ConfigTemplateParams & RouteTemplateParams;

  constructor(private outputDir: string, private config: ProjectConfig) {
    this.packageDir = path.join(outputDir, 'packages', 'ui');
    this.templateParams = {
      config,
      features: config.features,
    };
  }

  async generate(): Promise<void> {
    // Directory structure must be created first as the other generators depend on it.
    await this.createDirectoryStructure();
    // After that, we can generate the files in parallel.
    const generationPromises = [
      this.generateConfigFiles(),
      this.generateSourceFiles(),
      this.generateComponents(),
      this.generateRoutes(),
      this.generateStyles(),
      this.generateStorybook(),
    ];

    if (this.config.features.api) {
      generationPromises.push(this.generateSchemas());
      generationPromises.push(this.generateServices());
      generationPromises.push(this.generateHooks());
    }

    await Promise.all(generationPromises);
  }

  private async createDirectoryStructure(): Promise<void> {
    const componentDirs = componentDefinitions.map((comp) =>
      path.join('src', 'components', comp.dir)
    );
    let allDirs = [...baseDirectories, ...componentDirs];

    if (!this.config.features.api) {
      allDirs = allDirs.filter((dir) => dir !== 'src/services' && dir !== 'src/hooks');
    }

    const absoluteDirs = allDirs.map((dir) => path.join(this.packageDir, dir));

    for (const dir of [...new Set(absoluteDirs)]) {
      await fs.ensureDir(dir);
    }
  }

  private async generateConfigFiles(): Promise<void> {
    const files = {
      'README.md': this.generateReadme(),
      'package.json': generatePackageJson(this.templateParams),
      'vite.config.ts': generateViteConfig(this.templateParams),
      'tsconfig.json': generateTSConfig(),
      'tsconfig.node.json': generateTSConfigNode(),
      'index.html': generateIndexHtml(this.templateParams),
      'components.json': generateComponentsJson(this.templateParams),
      'eslint.config.mjs': generateESLintConfig(this.templateParams),
      '.prettierrc': generatePrettierRc(this.templateParams),
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.outputFile(path.join(this.packageDir, filename), content);
    }
  }

  private async generateSourceFiles(): Promise<void> {
    const files = {
      'src/main.tsx': generateMainTsx(),
      'src/routeTree.gen.ts': generateRouteTree(),
      'src/lib/utils.ts': generateCnUtil(),
    };

    for (const [filepath, content] of Object.entries(files)) {
      await fs.outputFile(path.join(this.packageDir, filepath), content);
    }
  }

  private async generateComponents(): Promise<void> {
    const componentsDir = path.join(this.packageDir, 'src', 'components');

    for (const comp of componentDefinitions) {
      if (comp.featureFlag && !this.config.features[comp.featureFlag]) {
        continue;
      }

      const componentPath = path.join(componentsDir, comp.dir, `${comp.file}.tsx`);
      const content = comp.passParams
        ? comp.generator(this.templateParams)
        : comp.generator(this.templateParams);
      await fs.outputFile(componentPath, content);

      if (comp.story) {
        const storyPath = path.join(componentsDir, comp.dir, `${comp.file}.stories.tsx`);
        const storyContent = comp.story.passParams
          ? comp.story.generator(this.templateParams)
          : comp.story.generator(this.templateParams);
        await fs.outputFile(storyPath, storyContent);
      }
    }
  }

  private async generateRoutes(): Promise<void> {
    const routesDir = path.join(this.packageDir, 'src', 'routes');

    // Always generate root and index routes
    await fs.outputFile(path.join(routesDir, '__root.tsx'), generateRootRoute(this.templateParams));

    await fs.outputFile(path.join(routesDir, 'index.tsx'), generateIndexRoute(this.templateParams));
  }

  private async generateStyles(): Promise<void> {
    await fs.outputFile(
      path.join(this.packageDir, 'src', 'styles', 'globals.css'),
      generateGlobalCSS()
    );
  }

  private async generateStorybook(): Promise<void> {
    const storybookDir = path.join(this.packageDir, '.storybook');

    await fs.outputFile(path.join(storybookDir, 'main.ts'), generateStorybookMain());

    await fs.outputFile(path.join(storybookDir, 'preview.ts'), generateStorybookPreview());
  }

  private async generateSchemas(): Promise<void> {
    const schemasDir = path.join(this.packageDir, 'src', 'schemas');

    await fs.outputFile(path.join(schemasDir, 'health.ts'), generateHealthSchema());
  }

  private async generateServices(): Promise<void> {
    const servicesDir = path.join(this.packageDir, 'src', 'services');

    await fs.outputFile(path.join(servicesDir, 'health.ts'), generateHealthService());
  }

  private async generateHooks(): Promise<void> {
    const hooksDir = path.join(this.packageDir, 'src', 'hooks');

    await fs.outputFile(path.join(hooksDir, 'health.ts'), generateHealthHook());
  }

  private generateReadme(): string {
    const hasApi = this.config.features.api;

    return `# ${this.config.name} UI

Modern React frontend application built with Vite and TanStack Router.

## Features

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety and modern JavaScript features
- **Vite** - Lightning fast development and build tool
- **TanStack Router** - Type-safe routing with automatic code splitting
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Storybook** - Component development and documentation
${hasApi ? '- **API Integration** - Ready-to-use API service layer' : ''}
- **Development** - Hot module replacement for instant feedback
- **Production** - Optimized builds with tree shaking and minification

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9+

### Development

1. **Install dependencies**:
\`\`\`bash
pnpm install
\`\`\`

2. **Start development server**:
\`\`\`bash
pnpm dev
\`\`\`

The application will be available at http://localhost:3000

## Available Scripts

\`\`\`bash
# Development
pnpm dev                # Start development server with hot reload
pnpm preview            # Preview production build locally

# Building
pnpm build              # Build for production
pnpm type-check         # Run TypeScript type checking

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint issues automatically
pnpm format             # Format code with Prettier
pnpm format:check       # Check code formatting

# Testing
pnpm test               # Run test suite (when implemented)

# Storybook
pnpm storybook          # Start Storybook development server
pnpm build-storybook    # Build Storybook for production
\`\`\`

## Project Structure

\`\`\`
src/
├── main.tsx                    # Application entry point
├── components/                 # Reusable UI components
│   ├── Card.tsx               # Basic card component
├── routes/                    # Application routes
│   ├── __root.tsx            # Root layout component
│   ├── index.tsx             # Home page
├── services/                  # External service integrations
${hasApi ? '│   └── api.ts                # API client configuration' : ''}
└── styles/
    └── globals.css           # Global styles and Tailwind imports
\`\`\`

## Routing

This application uses TanStack Router for type-safe routing:

Routes are automatically code-split for optimal loading performance.

${
  hasApi
    ? `## API Integration

The \`src/services/api.ts\` file provides a configured API client:

\`\`\`typescript
import { api } from './services/api';

// Example usage
const health = await api.get('/health');
\`\`\`

The API base URL is automatically configured to work with the backend API.
`
    : ''
}
## Styling

### Tailwind CSS
This project uses Tailwind CSS for styling. Key features:
- Utility-first approach for rapid development
- Responsive design utilities
- Dark mode support (when implemented)
- Custom component classes

### Component Development
- Use TypeScript interfaces for component props
- Follow React best practices for state management
- Implement responsive design from mobile-first
- Use semantic HTML elements for accessibility

## Development Tips

1. **Type Safety**: All routes are type-safe with TanStack Router
2. **Hot Reload**: Changes are instantly reflected in the browser
3. **Component Dev**: Use React DevTools for debugging
4. **Performance**: Vite provides built-in performance optimizations

## Building for Production

\`\`\`bash
pnpm build
\`\`\`

This creates an optimized production build in the \`dist/\` directory with:
- Minified JavaScript and CSS
- Tree-shaken dependencies
- Gzipped assets
- Automatic code splitting

## Deployment

The \`dist/\` folder can be deployed to any static hosting service:
- Vercel
- Netlify 
- AWS S3 + CloudFront
- GitHub Pages

For SPA routing, ensure your hosting service redirects all routes to \`index.html\`.

---

Generated with [AI Kickstart CLI](https://github.com/your-org/ai-kickstart)
`;
  }
}
