/**
 * UI Package Generator
 * Generates React/Vite/TanStack Router package
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import { generatePackageJson, generateReadme, generateViteConfig, generateTSConfig, generateTSConfigNode, generateGlobalCSS, generateStorybookMain, generateStorybookManager, generateStorybookPreview, generateComponentsJson, generateESLintConfig, generatePrettierRc, } from './templates/config/index.js';
import { generateIndexRoute, generateRootRoute, generateRouteTree, } from './templates/routes/index.js';
import { generateCnUtil } from './templates/components/index.js';
import { baseDirectories, components as componentDefinitions } from './component-structure.js';
import { generateHealthService } from './templates/services/health.js';
import { generateHealthHook } from './templates/hooks/health.js';
import { generateHealthSchema } from './templates/schemas/health.js';
import { generateIndexHtml, generateMainTsx } from './templates/main/index.js';
import { generateContainerfile } from './templates/containerfile.js';
import { generateVitestConfig, generateTestSetup, generateTestUtils, generateHeroTest, } from './templates/test/index.js';
export class UIPackageGenerator {
    constructor(outputDir, config) {
        this.outputDir = outputDir;
        this.config = config;
        this.packageDir = path.join(outputDir, 'packages', 'ui');
        this.templateParams = {
            config,
            features: config.features,
        };
    }
    async generate() {
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
            this.generateTestFiles(),
        ];
        if (this.config.features.api) {
            generationPromises.push(this.generateSchemas());
            generationPromises.push(this.generateServices());
            generationPromises.push(this.generateHooks());
        }
        await Promise.all(generationPromises);
    }
    async createDirectoryStructure() {
        const componentDirs = componentDefinitions.map((comp) => path.join('src', 'components', comp.dir));
        let allDirs = [...baseDirectories, ...componentDirs];
        if (!this.config.features.api) {
            allDirs = allDirs.filter((dir) => dir !== 'src/services' && dir !== 'src/hooks');
        }
        const absoluteDirs = allDirs.map((dir) => path.join(this.packageDir, dir));
        for (const dir of [...new Set(absoluteDirs)]) {
            await fs.ensureDir(dir);
        }
    }
    async generateConfigFiles() {
        const files = {
            'README.md': generateReadme(this.templateParams),
            'package.json': generatePackageJson(this.templateParams),
            'vite.config.ts': generateViteConfig(this.templateParams),
            'tsconfig.json': generateTSConfig(),
            'tsconfig.node.json': generateTSConfigNode(),
            'index.html': generateIndexHtml(this.templateParams),
            'components.json': generateComponentsJson(this.templateParams),
            'eslint.config.mjs': generateESLintConfig(this.templateParams),
            '.prettierrc': generatePrettierRc(this.templateParams),
            'Containerfile': generateContainerfile(this.templateParams),
            'vitest.config.ts': generateVitestConfig(),
        };
        for (const [filename, content] of Object.entries(files)) {
            await fs.outputFile(path.join(this.packageDir, filename), content);
        }
    }
    async generateSourceFiles() {
        const files = {
            'src/main.tsx': generateMainTsx(),
            'src/routeTree.gen.ts': generateRouteTree(),
            'src/lib/utils.ts': generateCnUtil(),
        };
        for (const [filepath, content] of Object.entries(files)) {
            await fs.outputFile(path.join(this.packageDir, filepath), content);
        }
    }
    async generateComponents() {
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
    async generateRoutes() {
        const routesDir = path.join(this.packageDir, 'src', 'routes');
        // Always generate root and index routes
        await fs.outputFile(path.join(routesDir, '__root.tsx'), generateRootRoute(this.templateParams));
        await fs.outputFile(path.join(routesDir, 'index.tsx'), generateIndexRoute(this.templateParams));
    }
    async generateStyles() {
        await fs.outputFile(path.join(this.packageDir, 'src', 'styles', 'globals.css'), generateGlobalCSS());
    }
    async generateStorybook() {
        const storybookDir = path.join(this.packageDir, '.storybook');
        await fs.outputFile(path.join(storybookDir, 'main.ts'), generateStorybookMain());
        await fs.outputFile(path.join(storybookDir, 'manager.ts'), generateStorybookManager());
        await fs.outputFile(path.join(storybookDir, 'preview.ts'), generateStorybookPreview());
    }
    async generateSchemas() {
        const schemasDir = path.join(this.packageDir, 'src', 'schemas');
        await fs.outputFile(path.join(schemasDir, 'health.ts'), generateHealthSchema());
    }
    async generateServices() {
        const servicesDir = path.join(this.packageDir, 'src', 'services');
        await fs.outputFile(path.join(servicesDir, 'health.ts'), generateHealthService());
    }
    async generateHooks() {
        const hooksDir = path.join(this.packageDir, 'src', 'hooks');
        await fs.outputFile(path.join(hooksDir, 'health.ts'), generateHealthHook());
    }
    async generateTestFiles() {
        const testDir = path.join(this.packageDir, 'src', 'test');
        const heroDir = path.join(this.packageDir, 'src', 'components', 'hero');
        await Promise.all([
            fs.outputFile(path.join(testDir, 'setup.ts'), generateTestSetup()),
            fs.outputFile(path.join(testDir, 'test-utils.tsx'), generateTestUtils()),
            fs.outputFile(path.join(heroDir, 'hero.test.tsx'), generateHeroTest(this.templateParams)),
        ]);
    }
}
