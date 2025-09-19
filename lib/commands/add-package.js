import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { z } from 'zod';
// Add package arguments schema
const AddPackageArgsSchema = z.object({
    packageName: z.string(),
    targetProject: z.string().optional(),
});
// Parse arguments specific to add-package command
function parseAddPackageArgs(args) {
    const parsed = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--project' || arg === '-p') {
            parsed.targetProject = args[++i];
        }
        else if (!arg.startsWith('-') && !parsed.packageName) {
            parsed.packageName = arg;
        }
    }
    return AddPackageArgsSchema.parse(parsed);
}
// Add package command component
function AddPackageCommand({ args }) {
    const [showDemo, setShowDemo] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    useInput((input) => {
        if (input === 'd' && !showDemo && !isComplete) {
            setShowDemo(true);
        }
    });
    if (showDemo && !isComplete) {
        return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsxs(Text, { color: "blue", children: ["\u23F3 Adding package \"", args.packageName, "\"... (demo)"] }), _jsx(Text, { color: "gray", children: "This would show a progress indicator." })] }));
    }
    if (isComplete) {
        return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsx(Text, { color: "green", bold: true, children: "\u2705 Package Added Successfully!" }), _jsxs(Text, { color: "gray", children: ["Package ", _jsx(Text, { color: "cyan", children: args.packageName }), " has been added to your project."] }), _jsx(Text, { color: "gray", children: "(This is just a demo - feature coming soon!)" })] }));
    }
    return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsx(Text, { color: "yellow", bold: true, children: "\uD83D\uDEA7 Coming Soon!" }), _jsx(Text, { children: "The add-package command is not yet implemented." }), _jsx(Text, { color: "gray", children: "This will allow you to add new packages to existing projects." }), _jsxs(Text, { children: ["Would add package: ", _jsx(Text, { color: "cyan", children: args.packageName }), args.targetProject && (_jsxs(Text, { children: [' ', "to project: ", _jsx(Text, { color: "cyan", children: args.targetProject })] }))] }), _jsx(Box, { marginTop: 1, children: _jsxs(Text, { color: "blue", children: ["\uD83D\uDCA1 Press ", _jsx(Text, { color: "yellow", children: "d" }), " to see a demo of the progress indicator"] }) })] }));
}
// Export the add-package command configuration
export const addPackageCommand = {
    name: 'add-package',
    description: 'Add a new package to an existing project',
    usage: 'rh-ai-kickstart add-package <package-name> [options]',
    examples: [
        'rh-ai-kickstart add-package auth',
        'rh-ai-kickstart add-package payments --project my-app',
    ],
    component: AddPackageCommand,
    parseArgs: parseAddPackageArgs,
};
