import { z } from 'zod';
declare const ArgsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    skipDependencies: z.ZodDefault<z.ZodBoolean>;
    outputDir: z.ZodDefault<z.ZodString>;
    packages: z.ZodOptional<z.ZodArray<z.ZodEnum<[string, ...string[]]>, "many">>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    outputDir: string;
    skipDependencies: boolean;
    name?: string | undefined;
    description?: string | undefined;
    packages?: string[] | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    packages?: string[] | undefined;
    outputDir?: string | undefined;
    skipDependencies?: boolean | undefined;
}>;
type Args = z.infer<typeof ArgsSchema>;
interface AppProps {
    args: Args;
}
export declare function App({ args }: AppProps): import("react/jsx-runtime").JSX.Element | null;
export {};
