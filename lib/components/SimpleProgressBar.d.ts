interface SimpleProgressBarProps {
    /** Progress percentage (0-100) */
    progress: number;
    /** Width of the progress bar */
    width?: number;
    /** Character to use for completed progress */
    fillChar?: string;
    /** Character to use for remaining progress */
    emptyChar?: string;
    /** Show percentage text */
    showPercentage?: boolean;
}
export declare function SimpleProgressBar({ progress, width, fillChar, emptyChar, showPercentage, }: SimpleProgressBarProps): import("react/jsx-runtime").JSX.Element;
export {};
