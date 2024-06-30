import {z} from 'zod'

export const usernameValidation=z
    .string()
    .min(2,'Username Must Be Atleasr 2 characters')
    .max(20,'Username Must Be Atleasr 2 characters')
    .regex(/^[a-zA-Z0-9]+$/,'No Special Characters Allowed')



export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:'Invalid Email'}),
    password:z.string().min(6,{message:'Password Must Contain Atleast 6 characters'}).regex(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-]+$/, {message: 'Password must contain alphabets, numbers, and special symbols'}),
})


