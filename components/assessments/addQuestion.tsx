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
import { MdOutlineQuiz } from "react-icons/md";


const formSchema = z.object({
    question: z.string().min(2).max(100),
    option1: z.string(),
    option2: z.string(),
    option3: z.string(),
    option4: z.string(),
    correctAnswer: z.string().nonempty(),
    pdfFile: z.union([z.instanceof(File), z.literal(null)]).optional(),
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

      const [isDialogOpen, setIsDialogOpen] = useState(false);

      const openDialog = () => {
        setIsDialogOpen(true);
      };

      async function onSubmit(values: z.infer<typeof formSchema>) {

        await addQuestion(values, classId, assessmentId);
        form.reset();
        setIsDialogOpen(false);
      }
    

  return (
    <Dialog open={isDialogOpen}>
    <DialogTrigger asChild onClick={openDialog} className='hover:cursor-pointer hover:bg-gray-100 w-full p-2 rounded-md flex items-center gap-2'>
      <div className='grow text-sm'>
        <MdOutlineQuiz />
        <span>Multiple choice</span>
      </div>
   
    </DialogTrigger>
    <DialogContent className="sm:w-[425px] md:w-[600px] h-[550px]">
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
    
        <Button type="submit" className='mt-6'>Add Question</Button>

      </form>
    </Form>
    </ScrollArea>
    </DialogContent>
  </Dialog>
  )
}


export default AddQuestion;