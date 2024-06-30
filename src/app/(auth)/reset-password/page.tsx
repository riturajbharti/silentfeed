'use client'
import React, { useEffect, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
// import { useRouter } from 'next/router'
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema'
import Email from 'next-auth/providers/email'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { resetPassUserSchema } from '@/schemas/resetPassUserSchema'



const page = () => {
    const { toast } = useToast()
    const router=useRouter();
    const [identifier,setIdentifier]=useState('')

    const form=useForm<z.infer<typeof resetPassUserSchema>>({
        resolver:zodResolver(resetPassUserSchema),
        defaultValues:{
          identifier:'',
        }
    })

    const onsubmit =async (data:z.infer<typeof resetPassUserSchema>) => {
        try {
          const response=await axios.post<ApiResponse>('/api/send-reset-email',data)
          toast({
            title:'Success',
            description:response.data.message
          })
          const url_data=encodeURIComponent(data.identifier);
          router.replace(`/verify-reset-password/${url_data}`)
        } catch (error) {
          console.error("Error in Finding user",error)
          const axiosError= error as AxiosError<ApiResponse>;
          let errorMessage=axiosError.response?.data.message
          toast({
            title:"User Cannot be Found",
            description:errorMessage,
            variant:'destructive'
          })
    
        }
      }



    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Reset Password
          </h1>
        </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onsubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                      <Input placeholder="username/email" {...field} 
                      />
                   

                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {
                  'Send Verification Code'
                }
              </Button>
              </form>
            </Form>

      </div>

    </div>
    )
}

export default page
