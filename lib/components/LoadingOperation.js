import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { SimpleProgress } from './ProgressIndicator.js';
export function LoadingOperation({ operation, duration = 2000, onComplete, onError, }) {
    const [isComplete, setIsComplete] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsComplete(true);
            onComplete();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onComplete]);
    return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsx(SimpleProgress, { label: isComplete ? `✅ ${operation} complete!` : `⏳ ${operation}...`, spinning: !isComplete }), !isComplete && _jsxs(Text, { color: "gray", children: ["Please wait while we ", operation.toLowerCase(), "..."] })] }));
}
