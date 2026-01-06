import { z } from 'zod';
import { Command } from './types.js';
declare const CreateArgsSchema: z.ZodObject<{
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
export type CreateArgs = z.infer<typeof CreateArgsSchema>;
export declare const createCommand: Command;
export {};
