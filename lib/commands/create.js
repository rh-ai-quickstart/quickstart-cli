import { jsx as _jsx } from "react/jsx-runtime";
import { z } from 'zod';
import { App as CreateApp } from '../components/App.js';
// Create command arguments schema
const CreateArgsSchema = z.object({
    name: z.string().optional(),
    skipDependencies: z.boolean().default(false),
    skipHeader: z.boolean().default(false),
    outputDir: z.string().default(process.cwd()),
    // Package selection and description
    packages: z.array(z.enum(['api', 'ui', 'db'])).optional(),
    description: z.string().optional(),
});
// Parse arguments specific to create command
function parseCreateArgs(args) {
    const parsed = {
        skipDependencies: false,
        skipHeader: false,
        outputDir: process.cwd(),
        packages: undefined,
        description: undefined,
    };
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--skip-dependencies' || arg === '--skip-deps') {
            parsed.skipDependencies = true;
        }
        else if (arg === '--skip-header') {
            parsed.skipHeader = true;
        }
        else if (arg === '--output-dir' || arg === '-o') {
            parsed.outputDir = args[++i];
        }
        else if (arg === '--packages' || arg === '-p') {
            const packagesStr = args[++i];
            if (packagesStr) {
                parsed.packages = packagesStr.split(',').map((p) => p.trim());
            }
        }
        else if (arg === '--description' || arg === '-d') {
            parsed.description = args[++i];
        }
        else if (!arg.startsWith('-') && !parsed.name) {
            parsed.name = arg;
        }
    }
    return CreateArgsSchema.parse(parsed);
}
// Create command component
function CreateCommand({ args }) {
    return _jsx(CreateApp, { args: args });
}
// Export the create command configuration
export const createCommand = {
    name: 'create',
    description: 'Create a new AI-powered full-stack project',
    usage: 'rh-ai-kickstart create [project-name] [options]',
    examples: [
        'rh-ai-kickstart create my-app',
        'rh-ai-kickstart create my-app --skip-header',
        'rh-ai-kickstart create my-app --skip-deps',
        'rh-ai-kickstart create my-app --output-dir ~/projects',
        'rh-ai-kickstart create my-app --packages api,ui,db',
        'rh-ai-kickstart create my-app -p api,ui',
        'rh-ai-kickstart create my-app -p db --description "Database service"',
        'rh-ai-kickstart create my-app --packages ui -d "Frontend application"',
    ],
    component: CreateCommand,
    parseArgs: parseCreateArgs,
};
