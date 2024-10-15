import { z } from "zod";
export declare const sessionSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    expiresAt: z.ZodEnum<undefined>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string;
    userId?: string;
    expiresAt?: unknown;
}, {
    id?: string;
    userId?: string;
    expiresAt?: unknown;
}>;
export type Session = z.infer<typeof sessionSchema>;
