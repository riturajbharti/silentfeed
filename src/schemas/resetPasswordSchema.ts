import {z} from 'zod';

export const resetPasswordSchema=z.object({
    code: z.string().length(6,'Verification code Must be 6 Digits'),
    newpassword:z.string().min(6,{message:'Password Must Contain Atleast 6 characters'}).regex(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-]+$/, {message: 'Password must contain alphabets, numbers, and special symbols'}),
    confirmpassword:z.string().min(6,{message:'Password Must Contain Atleast 6 characters'}).regex(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-]+$/, {message: 'Password must contain alphabets, numbers, and special symbols'}),
})