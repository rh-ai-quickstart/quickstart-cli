import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import { getCommand, getAllCommands } from '../commands/registry.js';
function GlobalHelp() {
    const commands = getAllCommands();
    return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsx(Gradient, { name: "rainbow", children: _jsx(BigText, { text: "AI Kickstart", font: "block" }) }), _jsx(Text, { color: "gray", children: "Create and manage AI-powered full-stack applications" }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "green", bold: true, children: "Usage:" }) }), _jsx(Text, { children: " rh-ai-kickstart <command> [options]" }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "green", bold: true, children: "Available Commands:" }) }), commands.map((cmd) => (_jsxs(Box, { flexDirection: "row", marginLeft: 2, children: [_jsx(Box, { width: 16, children: _jsx(Text, { color: "cyan", children: cmd.name }) }), _jsx(Text, { color: "gray", children: cmd.description })] }, cmd.name))), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "green", bold: true, children: "Global Options:" }) }), _jsxs(Box, { flexDirection: "row", marginLeft: 2, children: [_jsx(Box, { width: 16, children: _jsx(Text, { color: "yellow", children: "-h, --help" }) }), _jsx(Text, { color: "gray", children: "Show help for command" })] }), _jsxs(Box, { flexDirection: "row", marginLeft: 2, children: [_jsx(Box, { width: 16, children: _jsx(Text, { color: "yellow", children: "-v, --version" }) }), _jsx(Text, { color: "gray", children: "Show version number" })] }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "green", bold: true, children: "Examples:" }) }), _jsx(Text, { color: "gray", children: " rh-ai-kickstart create my-app" }), _jsx(Text, { color: "gray", children: " rh-ai-kickstart add-package auth" }), _jsx(Text, { color: "gray", children: " rh-ai-kickstart remove-package old-feature" }), _jsx(Text, { color: "gray", children: " rh-ai-kickstart create --help" }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "gray", children: "For more information, visit: https://github.com/your-org/ai-kickstart" }) })] }));
}
function CommandHelp({ command }) {
    const cmd = getCommand(command);
    if (!cmd) {
        return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsxs(Text, { color: "red", children: ["\u274C Unknown command: ", command] }), _jsx(Text, { children: "Run 'rh-ai-kickstart --help' to see available commands." })] }));
    }
    return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsxs(Text, { color: "green", bold: true, children: ["Command: ", cmd.name] }), _jsx(Text, { color: "gray", children: cmd.description }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "green", bold: true, children: "Usage:" }) }), _jsxs(Text, { children: [" ", cmd.usage] }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "green", bold: true, children: "Examples:" }) }), cmd.examples.map((example, index) => (_jsxs(Text, { color: "gray", children: [' ', example] }, index)))] }));
}
export function CLI({ args }) {
    // Show version
    if (args.showVersion) {
        return (_jsx(Box, { paddingX: 2, paddingY: 1, children: _jsx(Text, { children: "1.0.0" }) }));
    }
    // Show global help
    if (args.showHelp && !args.command) {
        return _jsx(GlobalHelp, {});
    }
    // Show command help
    if (args.showHelp && args.command) {
        return _jsx(CommandHelp, { command: args.command });
    }
    // No command provided
    if (!args.command) {
        return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsx(Text, { color: "red", children: "\u274C No command provided" }), _jsx(Text, { children: "Run 'rh-ai-kickstart --help' to see available commands." })] }));
    }
    // Execute command
    const command = getCommand(args.command);
    if (!command) {
        return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsxs(Text, { color: "red", children: ["\u274C Unknown command: ", args.command] }), _jsx(Text, { children: "Run 'rh-ai-kickstart --help' to see available commands." })] }));
    }
    // Parse command-specific arguments and render component
    const CommandComponent = command.component;
    const commandArgs = command.parseArgs(args.args);
    return _jsx(CommandComponent, { args: commandArgs });
}
