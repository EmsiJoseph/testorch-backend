import {z} from "zod";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {users} from "../../infrastructure/database/schema";

export const userSchema = createSelectSchema(
    users
)

export const newUserSchema = createInsertSchema(users, {
    email: (schema) => schema.email.email(),
    password_hash: (schema) => schema.password_hash.min(8),
}).required({
        first_name: true,
        last_name: true,
        email: true,
        password_hash: true,
    });

export const signInSchema = createInsertSchema(users, {
    email: (schema) => schema.email.email(),
    password_hash: (schema) => schema.password_hash.min(8).max(31),
}).omit({
    id: true,
    first_name: true,
    last_name: true,
})

export const signUpSchema = z
    .object({
        first_name: z.string().min(3).max(31),
        last_name: z.string().min(3).max(31),
        email: z.string().min(3).max(31),
        password_hash: z.string().min(6).max(31),
        confirm_password: z.string().min(6).max(31),
    })
    .superRefine(({password_hash, confirm_password}, ctx) => {
        if (confirm_password !== password_hash) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["password"],
            });
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmPassword"],
            });
        }
    });



export type User = z.infer<typeof userSchema>;

export type NewUser = z.infer<typeof newUserSchema>;

// export type SignInDto = z.infer<typeof signInSchema>;



