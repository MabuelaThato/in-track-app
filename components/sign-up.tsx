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
import Image from 'next/image'


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
    <div className='register-bg border border-slate-200 drop-shadow'>
      <div className='text-center'>
      <Image
      src="/logo.png"
      alt='in-track logo'
      width={120}
      height={110}
      className='img'
      />
      <h1 className='text-4xl font-bold'>
        Welcome
      </h1>
      <p className='sub-text mb-8'>Please enter your credentials</p>

    </div>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(register)} className="space-y-6">
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
 
  </div>
  )
}

export default SignUp;