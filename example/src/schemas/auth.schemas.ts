import { z } from 'zod';

// Example Zod schema
export const AuthResponse = z.object({
    token: z.string().openapi({
        description: 'JWT token returned after successful login',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
});

export const UserParamsId = z.object({
    id: z
        .string()
        .uuid()
        .openapi({
            param: {
                name: 'id',
                in: 'path',
            },
            example: 'f8b50a58-23f5-4f20-a08b-53f233e704a1',
            description: 'The UUID of the user',
        }),
    page: z.number().int().openapi({
        param: {
            name: 'page',
            in: 'query',
        },
        example: 25,
        description: 'Page',
    }),
});
