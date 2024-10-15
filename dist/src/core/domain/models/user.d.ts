import { z } from "zod";
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    first_name: z.ZodString;
    last_name: z.ZodString;
    email: z.ZodString;
    password_hash: z.ZodString;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
}, {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
}>;
export declare const newUserSchema: z.ZodObject<{
    id: z.ZodString;
    first_name: z.ZodString;
    last_name: z.ZodString;
    email: z.ZodString;
    password_hash: z.ZodString;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
}, {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
}>;
export declare const signInSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    first_name: z.ZodString;
    last_name: z.ZodString;
    email: z.ZodString;
    password_hash: z.ZodString;
}, "id" | "first_name" | "last_name">, z.UnknownKeysParam, z.ZodTypeAny, {
    email?: string;
    password_hash?: string;
}, {
    email?: string;
    password_hash?: string;
}>;
export declare const signUpSchema: z.ZodEffects<z.ZodObject<{
    first_name: z.ZodString;
    last_name: z.ZodString;
    email: z.ZodString;
    password_hash: z.ZodString;
    confirm_password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
    confirm_password?: string;
}, {
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
    confirm_password?: string;
}>, {
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
    confirm_password?: string;
}, {
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
    confirm_password?: string;
}>;
export type User = z.infer<typeof userSchema>;
export type NewUser = z.infer<typeof newUserSchema>;
