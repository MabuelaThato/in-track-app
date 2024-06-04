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
import { signInWithEmailAndPassword } from 'firebase/auth'

import Link from 'next/link'
import { redirectUser } from '@/actions/actions'
import Image from 'next/image'


const formSchema = z.object({
    email: z.string().min(2, {
      message: "email must be at least 2 characters.",
    }),
    password: z.string().min(8, {
      message: "password must be at least 8 characters.",
    }),
})

const SignIn = () => {
    
    const [submitting, updateSubmitting] = useState(false);
 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    });

    async function logIn(values: z.infer<typeof formSchema>) {
      updateSubmitting(true);
        try {
          await signInWithEmailAndPassword(fireAuth, values.email, values.password);
          await redirectUser();

        } catch (error) {
          console.log(error);
          
          updateSubmitting(false); 
        }
      }

  return (
  <div className='form-bg text-center border border-slate-200 drop-shadow-2xl h-screen rounded-3xl'>
    <div className=''>
      <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mt-4 md:mt-2'>
        Welcome
      </h1>
      <p className='text-xs md:text-base lg:text-lg mb-8 md:mb-12'>Please enter your credentials</p>

    </div>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(logIn)} className="space-y-4 md:space-y-6">
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Password" 
                  {...field} 
                  type='password'
                  className='input focus:outline-none '
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" 
          disabled={submitting}
          className='w-full rounded-md'
          >
            {submitting? "Signing in..." : "Sign in"}
            </Button>
        </form>
      </Form>
   
    <div className='mt-6 text-xs md:text-base'>
      Don't have an account? <Link href="/register" className='underline'>Register here.</Link>
    </div>
  </div>
  )
}

export default SignIn