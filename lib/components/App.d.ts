import { z } from 'zod';
declare const ArgsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    skipDependencies: z.ZodDefault<z.ZodBoolean>;
    skipHeader: z.ZodDefault<z.ZodBoolean>;
    outputDir: z.ZodDefault<z.ZodString>;
    packages: z.ZodOptional<z.ZodArray<z.ZodEnum<["api", "ui", "db"]>, "many">>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    outputDir: string;
    skipDependencies: boolean;
    skipHeader: boolean;
    name?: string | undefined;
    description?: string | undefined;
    packages?: ("api" | "ui" | "db")[] | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    packages?: ("api" | "ui" | "db")[] | undefined;
    outputDir?: string | undefined;
    skipDependencies?: boolean | undefined;
    skipHeader?: boolean | undefined;
}>;
type Args = z.infer<typeof ArgsSchema>;
interface AppProps {
    args: Args;
}
export declare function App({ args }: AppProps): import("react/jsx-runtime").JSX.Element | null;
export {};
