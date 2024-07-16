"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { fireAuth } from "@/components/provider"
import { sendPasswordResetEmail } from 'firebase/auth'
import { RedirectHome } from '@/actions/actions'
import toast from 'react-hot-toast'


const formSchema = z.object({
    email: z.string().min(2, {
      message: "email must be at least 2 characters.",
    }),
})

const ResetPassword = () => {

    const [submitting, updateSubmitting] = useState(false);
 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        },
    });

    async function Reset(values: z.infer<typeof formSchema>) {
      updateSubmitting(true);
        try {

            const auth = fireAuth;

            sendPasswordResetEmail(auth, values.email)
            .then(async() => {
              toast.success("A password reset email has been sent to your email.",{
                duration: 5000
              })
              await RedirectHome()
            })
            .catch((error: any) => {
              const errorCode = error.code;
              const errorMessage = error.message;
                console.log("Error Message:  ",errorMessage)
                toast.error("Password reset unsuccessful, please try again.",{
                  duration: 5000
                })
            });

        } catch (error) {
          console.log(error);
          
          updateSubmitting(false); 
        }
      }

  return (
    <div className='flex bg h-screen flex-col items-center justify-center'>
    <div className='password-bg text-center border border-slate-200 drop-shadow-2xl h-screen rounded-3xl'>
    <div className=''>
      <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mt-4 md:mt-2'>
        Forgot password
      </h1>
      <p className='text-xs md:text-base lg:text-lg mb-8 md:mb-12'>
        Enter the email you would like us to send the password reset email to.
      </p>

    </div>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(Reset)} className="space-y-4 md:space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                  placeholder="Email" 
                  {...field} 
                  className='input focus:outline-none'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" 
          disabled={submitting}
          className='w-full rounded-md '
          >
            {submitting? "Reseting..." : "Reset"}
            </Button>
        </form>
      </Form>
  </div>
  </div>
  )
}

export default ResetPassword
