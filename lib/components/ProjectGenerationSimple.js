import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { ProgressIndicator } from './ProgressIndicator.js';
import { ProjectGenerator } from '../generators/index.js';
import * as path from 'path';
const STEP_LABELS = [
    'Project directory',
    'Root configuration',
    'UI package',
    'API package',
    'Database package',
    'Dependencies',
    'Git repository',
];
export function ProjectGenerationSimple({ config, outputDir, skipDependencies = false, onComplete, onError, }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [currentFile, setCurrentFile] = useState('');
    const [totalSteps, setTotalSteps] = useState(STEP_LABELS.length);
    useEffect(() => {
        generateProject();
    }, []);
    const generateProject = async () => {
        try {
            const projectOutputDir = path.join(outputDir, config.name);
            // Create generator instance
            const generator = new ProjectGenerator(projectOutputDir, config, { skipDependencies });
            const generatorIterator = generator.generateProject();
            // Process generator steps one by one with delays
            const processNextStep = async () => {
                const { value: step, done } = await generatorIterator.next();
                if (!done && step) {
                    const progressPercent = (step.currentStep / step.totalSteps) * 100;
                    setProgress(progressPercent);
                    setCurrentStepIndex(step.currentStep - 1);
                    setCurrentFile(step.message);
                    setTotalSteps(step.totalSteps);
                    // Continue to next step after a delay
                    setTimeout(processNextStep, 200);
                }
                else {
                    // Generation complete
                    setProgress(100);
                    setIsComplete(true);
                    setCurrentFile('Complete!');
                    setTimeout(() => {
                        onComplete(projectOutputDir);
                    }, 500);
                }
            };
            // Start processing
            processNextStep();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            onError(errorMessage);
        }
    };
    const currentStepLabel = STEP_LABELS[currentStepIndex] || currentFile;
    return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsx(Box, { flexDirection: "column", marginBottom: 2, children: _jsxs(Text, { color: "cyan", bold: true, children: ["\uD83D\uDD27 Generating Project: ", config.name] }) }), _jsx(ProgressIndicator, { progress: progress, label: currentStepLabel || 'Processing...', currentStep: currentStepIndex + 1, totalSteps: totalSteps, isComplete: isComplete, width: 50 }), !isComplete && (_jsx(Text, { color: "gray", children: "This may take a few moments depending on the selected packages..." })), isComplete && _jsx(Text, { color: "green", children: "\uD83C\uDF89 Project generation complete!" })] }));
}
