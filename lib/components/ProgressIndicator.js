import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { SimpleProgressBar } from './SimpleProgressBar.js';
export function ProgressIndicator({ progress, label, currentStep, totalSteps, isComplete = false, width = 50, estimatedTimeRemaining, }) {
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { flexDirection: "row", marginBottom: 1, children: [!isComplete && _jsx(Spinner, { type: "dots" }), isComplete && _jsx(Text, { color: "green", children: "\u2705" }), _jsx(Box, { marginLeft: 1, children: _jsx(Text, { children: label }) })] }), _jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Box, { marginBottom: 1, children: _jsx(SimpleProgressBar, { progress: progress, width: width, showPercentage: false }) }), _jsxs(Box, { flexDirection: "row", justifyContent: "space-between", children: [_jsx(Box, { children: currentStep && totalSteps && (_jsxs(Text, { color: "gray", children: ["Step ", currentStep, " of ", totalSteps] })) }), _jsxs(Box, { flexDirection: "row", children: [estimatedTimeRemaining && !isComplete && (_jsx(Box, { marginRight: 2, children: _jsxs(Text, { color: "gray", children: ["~", estimatedTimeRemaining, " remaining"] }) })), _jsxs(Text, { color: "gray", children: [Math.round(progress), "%"] })] })] })] })] }));
}
export function SimpleProgress({ label, spinning = true }) {
    return (_jsxs(Box, { flexDirection: "row", marginBottom: 1, children: [spinning && _jsx(Spinner, { type: "dots" }), _jsx(Box, { marginLeft: spinning ? 1 : 0, children: _jsx(Text, { children: label }) })] }));
}
