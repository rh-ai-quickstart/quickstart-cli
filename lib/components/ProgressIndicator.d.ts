interface ProgressIndicatorProps {
    /** Current progress percentage (0-100) */
    progress: number;
    /** Current step label */
    label: string;
    /** Current step number */
    currentStep?: number;
    /** Total number of steps */
    totalSteps?: number;
    /** Whether the operation is complete */
    isComplete?: boolean;
    /** Width of the progress bar */
    width?: number;
    /** Show estimated time remaining */
    estimatedTimeRemaining?: string;
}
export declare function ProgressIndicator({ progress, label, currentStep, totalSteps, isComplete, width, estimatedTimeRemaining, }: ProgressIndicatorProps): import("react/jsx-runtime").JSX.Element;
interface SimpleProgressProps {
    /** Progress label */
    label: string;
    /** Whether to show spinner */
    spinning?: boolean;
}
export declare function SimpleProgress({ label, spinning }: SimpleProgressProps): import("react/jsx-runtime").JSX.Element;
export {};
