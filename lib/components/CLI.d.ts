interface CLIArgs {
    command?: string;
    args: string[];
    showHelp?: boolean;
    showVersion?: boolean;
}
interface CLIProps {
    args: CLIArgs;
}
export declare function CLI({ args }: CLIProps): import("react/jsx-runtime").JSX.Element;
export {};
