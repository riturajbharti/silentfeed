'use client'
import React, { useEffect, useState } from 'react'
import { useParams,useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';


const page = () => {
    const router =useRouter();
    const params = useParams<{username:string}>();
    const identifier=params.username;
    const decoded_identifier=decodeURIComponent(identifier);
    const [confirmpassword,setConfirmpassword]=useState('');
    const [passwordMessage,setPasswordMessage]=useState('')
    const [isCheckingPassword,setIsCheckingPassword]=useState(false)
    const [passwordMatch,setPasswordMatch]=useState(false);
    const debounced=useDebounceCallback(setConfirmpassword,30)
    const {toast}=useToast();

    const form=useForm<z.infer<typeof resetPasswordSchema>>({
        resolver:zodResolver(resetPasswordSchema),
        defaultValues:{
          code:'',
          newpassword:'',
          confirmpassword:'',
        }
      })

    useEffect(()=>{
        const matchPassword=async() =>{
            setIsCheckingPassword(true);
            setPasswordMessage('');
            if(confirmpassword===''){
                setPasswordMatch(true);
                setPasswordMessage('');
            }else if(confirmpassword!=form.getValues('newpassword')){
                setPasswordMatch(true);
                setPasswordMessage('Passwords Do Not Match');
            }else{
                setPasswordMatch(false);

                setPasswordMessage('Passwords Match');
            }
            setIsCheckingPassword(false);
            
        }
        matchPassword();
    },[confirmpassword])

    const onsubmit =async (data:z.infer<typeof resetPasswordSchema>) => {
        try {
          const response=await axios.post<ApiResponse>(`/api/reset-password?identifier=${identifier}`,data)
          
          if(response.data.success){
            toast({
                title:'Success',
                description:response.data.message
            })
          }else{
            toast({
                title:'Cannot Update Password',
                description:response.data.message
            })
          }

          
    
          router.replace(`/sign-in/`)
        } catch (error) {
          console.error("Error in Reseting Password",error)
          const axiosError= error as AxiosError<ApiResponse>;
          let errorMessage=axiosError.response?.data.message
          toast({
            title:"Cannot Reset Password beacuse of",
            description:errorMessage,
            variant:'destructive'
          })
    
        }
      }


  return (
    <div>
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Verification Code" {...field}                       
                      />
                   

                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="New Password" {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm Password" {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                      />
                    </FormControl>
                    {
                      isCheckingPassword && <Loader2 className="animate-spin" />  
                    }
                    <p className={`text-sm ${passwordMessage === "Passwords Do Not Match" ? `text-red-500` :'text-green-500'}` }>
                        {passwordMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={passwordMatch}>
                Submit
              </Button>
              </form>
            </Form>


      </div>

    </div>
    </div>
  )
}

export default page
