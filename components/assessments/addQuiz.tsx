"use client"
import React, { useState } from 'react'
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
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '../ui/textarea';


const formSchema = z.object({
    title: z.string().min(2).max(50),
    quizType: z.string().min(2).max(50),
    instruction: z.string().min(2),
    passPercentage: z.string()
  })

const AddQuiz = ({classId}: {classId: string}) => {

  const [uploading, setUploading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          quizType: "",
          instruction: "",
        },
      })

      const [date, setDate] = React.useState<Date>()
      const month = date?.getMonth();
      let selectedMonth = "";

      switch(month){ 
        case 0: { 
           selectedMonth = "January"
           break; 
        } 
        case 1: { 
           selectedMonth = "February"
           break; 
        } 
        case 2: { 
           selectedMonth = "March"
           break; 
        } 
        case 3: { 
           selectedMonth = "April"
           break; 
        } 
        case 4: { 
           selectedMonth = "May"
           break; 
        } 
        case 5: { 
           selectedMonth = "June"
           break; 
        } 
        case 6: { 
           selectedMonth = "July"
           break; 
        } 
        case 7: { 
           selectedMonth = "August"
           break; 
        } 
        case 8: { 
           selectedMonth = "September"
           break; 
        } 
        case 9: { 
           selectedMonth = "October"
           break; 
        } 
        case 10: { 
           selectedMonth = "November"
           break; 
        } 
        case 11: { 
           selectedMonth = "December"
           break; 
        } 
     } 

     const currentDay = date?.getDate();
     const year = date?.getFullYear();

     const today = currentDay + " " + selectedMonth + " " + year;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await createQuiz(values, classId, today);
        setUploading(true);
        window.location.reload();
      }

  return (
    <Dialog>
    <DialogTrigger asChild className='bg-[#064789] hover:border hover:cursor-pointer hover:border-[#064789] hover:text-[#064789] hover:bg-white rounded-md p-2 text-white flex gap-2 items-center w-40 lg:w-auto h-10'>
      <div>
        <FaPlus />
        <span className='lg:grow text-sm'>Add assessment</span>
      </div>
    </DialogTrigger>
    <DialogContent className="max-w-[420px] rounded">
      <DialogHeader>
        <DialogTitle>Create a new assessment</DialogTitle>
        <DialogDescription>Enter all the information. Click create when you're done.</DialogDescription>
    </DialogHeader>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        name="quizType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type of assessment</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of assessment you want to create." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Written assignment</SelectItem>
                </SelectContent>
              </Select>
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
              <Textarea placeholder="What the learners will be required to do." {...field}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="passPercentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pass percentage</FormLabel>
            <FormControl>
              <Input placeholder="eg. 60" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
            <div>
            <Label className='mb-2'>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            </div>
 
      <DialogFooter>
        <Button type="submit">
        {
            uploading ? (<div>Creating...</div>) : (<div>Create assessment</div>)
        }

        </Button>
      </DialogFooter>
      </form>
    </Form>
    </DialogContent>
  </Dialog>
  )
}

export default AddQuiz