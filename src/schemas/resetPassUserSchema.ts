import {z} from 'zod';

export const resetPassUserSchema=z.object({
    identifier: z.string(),
})