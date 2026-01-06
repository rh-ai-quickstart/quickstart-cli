import { jsx as _jsx } from "react/jsx-runtime";
import { z } from 'zod';
import { App as CreateApp } from '../components/App.js';
import { PackageIdEnum } from '../types/features.js';
// Create command arguments schema
const CreateArgsSchema = z.object({
    name: z.string().optional(),
    skipDependencies: z.boolean().default(false),
    outputDir: z.string().default(process.cwd()),
    // Package selection and description - derived from PACKAGES
    packages: z.array(PackageIdEnum()).optional(),
    description: z.string().optional(),
});
// Parse arguments specific to create command
function parseCreateArgs(args) {
    const parsed = {
        skipDependencies: false,
        outputDir: process.cwd(),
        packages: undefined,
        description: undefined,
    };
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--skip-dependencies' || arg === '-s') {
            parsed.skipDependencies = true;
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
    usage: 'quickstart create [project-name] [options]',
    examples: [
        'quickstart create my-app',
        'quickstart create my-app --skip-dependencies',
        'quickstart create my-app -s',
        'quickstart create my-app --output-dir ~/projects',
        'quickstart create my-app --packages api,ui,db',
        'quickstart create my-app --packages "api, ui, db"',
        'quickstart create my-app -p api,ui',
        'quickstart create my-app -p db --description "Database service"',
        'quickstart create my-app --packages ui -d "Frontend application"',
    ],
    component: CreateCommand,
    parseArgs: parseCreateArgs,
};
