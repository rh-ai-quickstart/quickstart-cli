import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useInput } from 'ink';
export function ErrorMessage({ error, onRestart, onExit }) {
    useInput((input) => {
        if (input === 'r') {
            onRestart();
        }
        else if (input === 'q' || input === 'e') {
            onExit();
        }
    });
    const getSuggestions = (error) => {
        const suggestions = [];
        if (error.includes('EACCES') || error.includes('permission')) {
            suggestions.push('• Try running with different permissions');
            suggestions.push('• Choose a different output directory');
            suggestions.push('• Check if the directory is in use by another process');
        }
        if (error.includes('ENOENT') || error.includes('not found')) {
            suggestions.push('• Check that all required tools are installed');
            suggestions.push('• Verify the template directory exists');
            suggestions.push('• Make sure pnpm/npm is available in your PATH');
        }
        if (error.includes('already exists')) {
            suggestions.push('• Choose a different project name');
            suggestions.push('• Remove the existing directory');
            suggestions.push('• Use a different output directory');
        }
        if (error.includes('network') || error.includes('timeout')) {
            suggestions.push('• Check your internet connection');
            suggestions.push('• Try again in a few moments');
            suggestions.push('• Consider using a different registry');
        }
        if (error.includes('invalid') || error.includes('validation')) {
            suggestions.push('• Check your project name format');
            suggestions.push('• Ensure all required fields are filled');
            suggestions.push('• Try with different configuration options');
        }
        if (suggestions.length === 0) {
            suggestions.push('• Try restarting the CLI');
            suggestions.push('• Check the GitHub issues for similar problems');
            suggestions.push('• Run with verbose logging for more details');
        }
        return suggestions;
    };
    const suggestions = getSuggestions(error);
    return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "red", padding: 2, marginY: 1, children: [_jsx(Text, { color: "red", bold: true, children: "\u274C Oops! Something went wrong" }), _jsx(Text, { color: "gray", children: "We encountered an error while creating your project." }), _jsxs(Box, { marginY: 1, borderStyle: "single", borderColor: "red", padding: 1, flexDirection: "column", children: [_jsx(Text, { color: "red", bold: true, children: "Error Details:" }), _jsx(Text, { color: "white", children: error })] }), _jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Text, { color: "yellow", bold: true, children: "\uD83D\uDCA1 Suggested Solutions:" }), suggestions.map((suggestion, index) => (_jsx(Text, { color: "gray", children: suggestion }, index)))] }), _jsxs(Box, { marginTop: 1, borderStyle: "single", borderColor: "blue", padding: 1, flexDirection: "column", children: [_jsx(Text, { color: "blue", bold: true, children: "\uD83D\uDD27 Troubleshooting Resources:" }), _jsx(Text, { children: "\u2022 Documentation: https://github.com/your-org/ai-kickstart" }), _jsx(Text, { children: "\u2022 Issues: https://github.com/your-org/ai-kickstart/issues" }), _jsx(Text, { children: "\u2022 Discord: https://discord.gg/your-server" })] }), _jsx(Box, { marginTop: 1, flexDirection: "row", justifyContent: "space-between", children: _jsxs(Text, { children: ["Press", ' ', _jsx(Text, { color: "green", bold: true, children: "r" }), ' ', "to restart \u2022 Press", ' ', _jsx(Text, { color: "red", bold: true, children: "q" }), ' ', "to quit"] }) })] }), _jsx(Text, { color: "gray", children: "If the problem persists, please report it with the error details above." })] }));
}
