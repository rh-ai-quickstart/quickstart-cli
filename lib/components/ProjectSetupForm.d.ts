import { ProjectConfig } from '../types/features.js';
interface ProjectSetupFormProps {
    initialName?: string;
    initialDescription?: string;
    cliFeatures?: Record<string, boolean>;
    onSubmit: (config: ProjectConfig) => void;
    onCancel: () => void;
}
export declare function ProjectSetupForm({ initialName, initialDescription, cliFeatures, onSubmit, onCancel, }: ProjectSetupFormProps): import("react/jsx-runtime").JSX.Element | null;
export {};
