"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";  
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { createQuiz } from '@/actions/actions';
import { DialogFooter } from '../ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const formSchema = z.object({
    title: z.string().min(2).max(50),
    instruction: z.string().min(2),
  })

const AddAssessment = ({classId}: {classId: string}) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          instruction: "",
        },
      })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await createQuiz(values, classId);
      }

  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button className='bg-[#064789] hover:border hover:border-[#064789] hover:text-[#064789] hover:bg-white flex gap-2 items-center'>
        <FaPlus />
        <span>Add Assessment</span>
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create a new assessment</DialogTitle>
        <DialogDescription>Enter all the information. Click create when you're done.</DialogDescription>
    </DialogHeader>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name of assessment</FormLabel>
            <FormControl>
              <Input placeholder="eg. Test 1 - Algebraic equations" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="instruction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instructions</FormLabel>
            <FormControl>
              <Input placeholder="What the learners will be required to do." {...field}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
 
      <DialogFooter>
        <Button type="submit">Create assessment</Button>
      </DialogFooter>
      </form>
    </Form>
    </DialogContent>
  </Dialog>
  )
}

export default AddAssessment