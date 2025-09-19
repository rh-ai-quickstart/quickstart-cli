import { z } from 'zod';
import { Command } from './types.js';
declare const AddPackageArgsSchema: z.ZodObject<{
    packageName: z.ZodString;
    targetProject: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    packageName: string;
    targetProject?: string | undefined;
}, {
    packageName: string;
    targetProject?: string | undefined;
}>;
export type AddPackageArgs = z.infer<typeof AddPackageArgsSchema>;
export declare const addPackageCommand: Command;
export {};
