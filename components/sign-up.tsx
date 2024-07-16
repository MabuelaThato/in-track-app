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
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {  registerUser } from '@/actions/actions'
import Link from 'next/link'


const formSchema = z.object({
    email: z.string().min(2, {
      message: "Please enter email.",
    }), 
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    lastname: z.string().min(1, {
      message: "Please enter your last name.",
    }),
    firstname: z.string().min(1, {
      message: "Please enter your first name.",
    }),
    
})

const SignUp = () => {

  const [submitting, updateSubmitting] = useState(false);
  
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        lastname: "",
        firstname: "",
        },
    });

    async function register(values: z.infer<typeof formSchema>) {
      
      updateSubmitting(true);

      try {
        await createUserWithEmailAndPassword(fireAuth, values.email, values.password);
        await registerUser(values);       
      } catch (error) {
        console.log(error);
        updateSubmitting(false);
      }
    }

  return (
    <div className='register-bg border border-slate-200 drop-shadow-2xl drop-shadow rounded-3xl'>
      <div className='text-center'>
      <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mt-4 md:mt-2'>
        Welcome
      </h1>
      <p className='text-xs md:text-base lg:text-lg mb-6 md:mb-8'>
        This is for teachers and admin users only. Learner's accounts are created by the admin or teacher.
      </p>

    </div>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(register)} className="space-y-2 md:space-y-4">
      <FormField
        control={form.control}
        name="firstname"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input 
              placeholder="First name" 
              {...field} 
              className='input focus:outline-none '
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastname"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input 
              placeholder="Last name" 
              {...field} 
              className='input focus:outline-none '
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input 
              placeholder="Email" 
              {...field} 
              className='input focus:outline-none '
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
              <Input 
              placeholder="Password" 
              {...field} 
              type='password'
              className='input focus:outline-none '
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" disabled={submitting} className='w-full'>
        { submitting? "Creating account..." : "Sign up"}</Button>
    </form>
  </Form>

  <div className='mt-6 text-xs md:text-base text-center'>
      Already have an account? <Link href="/" className='underline'>Login here.</Link>
    </div>
 
  </div>
  )
}

export default SignUp;