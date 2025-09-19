import { z } from 'zod';
import { Command } from './types.js';
declare const CreateArgsSchema: z.ZodObject<{
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
export type CreateArgs = z.infer<typeof CreateArgsSchema>;
export declare const createCommand: Command;
export {};
