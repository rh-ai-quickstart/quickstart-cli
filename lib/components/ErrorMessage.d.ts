interface ErrorMessageProps {
    error: string;
    onRestart: () => void;
    onExit: () => void;
}
export declare function ErrorMessage({ error, onRestart, onExit }: ErrorMessageProps): import("react/jsx-runtime").JSX.Element;
export {};
