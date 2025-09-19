interface LoadingOperationProps {
    /** Operation name */
    operation: string;
    /** Estimated duration in milliseconds */
    duration?: number;
    /** Callback when operation completes */
    onComplete: () => void;
    /** Callback if operation fails */
    onError?: (error: string) => void;
}
export declare function LoadingOperation({ operation, duration, onComplete, onError, }: LoadingOperationProps): import("react/jsx-runtime").JSX.Element;
export {};
