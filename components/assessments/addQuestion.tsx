"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";  
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { addQuestion } from '@/actions/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '../ui/textarea';
import { ScrollArea } from "@/components/ui/scroll-area"


const formSchema = z.object({
    question: z.string().min(2),
    option1: z.string(),
    option2: z.string(),
    option3: z.string(),
    option4: z.string(),
    correctAnswer: z.string().nonempty(),
  })

const AddQuestion = ({classId, assessmentId}: {classId: string, assessmentId: string }) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctAnswer: '',
        },
      })

      const [uploading, setUploading] = useState(false)

      async function onSubmit(values: z.infer<typeof formSchema>) {

        await addQuestion(values, classId, assessmentId);
        setUploading(true);
        window.location.reload();
       
      }
    

  return (
    <Dialog>
    <DialogTrigger asChild className='hover:cursor-pointer border border-[#A5BE00] bg-[#A5BE00] text-white hover:bg-white hover:text-[#A5BE00] rounded-md py-1.5 p-2 rounded-md flex items-center gap-2'>
      <div className='grow text-sm'>
        <FaPlus />
        <span>Add Question</span>
      </div>
   
    </DialogTrigger>
    <DialogContent className="max-w-[350px] md:max-w-[425px] rounded">
    <ScrollArea className='h-[450px]'>
     <DialogHeader className='mb-4'>
        <DialogTitle>Add a new question</DialogTitle>
        <DialogDescription>Enter all the information. Click create when you're done.</DialogDescription>
    </DialogHeader>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} >
    
        <FormField
        control={form.control}
        name="question"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Question</FormLabel>
            <FormControl>
                <Textarea placeholder="eg. What is the value of x: x + 1 = 2" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="correctAnswer"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Correct answer</FormLabel>
            <FormControl>
                <Input placeholder="eg. x=1" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <div className='mb-4'>
          <h1 className='font-semibold mt-4'>Multiple choice options</h1>
          <p className='text-sm text-neutral-500'>Make sure that the correct anwer and the correct option below are entered the same, meaning the should have the same spaces.
            <br />
            For example, "x+y" and "x + y" will produce incorrect marking.
          </p>
        </div>
        <FormField
        control={form.control}
        name="option1"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Option 1</FormLabel>
            <FormControl>
                <Input  {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="option2"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Option 2</FormLabel>
            <FormControl>
                <Input  {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="option3"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Option 3</FormLabel>
            <FormControl>
                <Input  {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="option4"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Option 4</FormLabel>
            <FormControl>
                <Input  {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
    
        <div className='flex justify-end'>
          <Button 
          type="submit" 
          className='mt-6'
          disabled={uploading}
          >
            {
              uploading ? (<div>Adding...</div>) : (<div>Add Question</div>)
            }
          </Button>
        </div>

      </form>
    </Form>
    </ScrollArea>
    </DialogContent>
  </Dialog>
  )
}


export default AddQuestion;