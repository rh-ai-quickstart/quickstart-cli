import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
export function SimpleProgressBar({ progress, width = 40, fillChar = '█', emptyChar = '░', showPercentage = true, }) {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    const filledWidth = Math.round((clampedProgress / 100) * width);
    const emptyWidth = width - filledWidth;
    const progressBar = fillChar.repeat(filledWidth) + emptyChar.repeat(emptyWidth);
    return (_jsxs(Box, { flexDirection: "row", alignItems: "center", children: [_jsx(Text, { color: "green", children: progressBar }), showPercentage && (_jsx(Box, { marginLeft: 1, children: _jsxs(Text, { color: "gray", children: [Math.round(clampedProgress), "%"] }) }))] }));
}
