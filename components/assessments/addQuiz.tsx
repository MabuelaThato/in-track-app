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
    passPercentage: z.string(),
    time: z.string(),
    attempts: z.string()
  })

const AddQuiz = ({classId}: {classId: string}) => {

  const [uploading, setUploading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          quizType: "",
          instruction: "",
          time: "",
          attempts: "",
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
    <DialogTrigger asChild className='bg-[#064789] hover:border hover:cursor-pointer hover:border-[#064789] hover:text-[#064789] hover:bg-white rounded-md p-2 text-white flex gap-2 items-center w-44 h-10'>
      <div>
        <FaPlus />
        <span className='lg:grow text-sm md:text-base'>Add assessment</span>
      </div>
    </DialogTrigger>
    <DialogContent className="w-[330px] md:w-[430px] rounded">
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
          <FormItem className='w-[300px] md:w-full'>
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
          <FormItem className='w-[300px] md:w-full'>
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
          <FormItem className='w-[300px] md:w-full'>
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
          <FormItem className='w-[300px] md:w-full'>
            <FormLabel>Pass percentage</FormLabel>
            <FormControl>
              <Input placeholder="eg. 60" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
            <div className='w-[300px] md:w-full'>
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

            <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className='w-[300px] md:w-full'>
              <FormLabel>Time Due</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the time the assessment will be due." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="00:00">00:00</SelectItem>
                  <SelectItem value="06:00">06:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="21:00">21:00</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="attempts"
          render={({ field }) => (
            <FormItem className='w-[300px] md:w-full'>
              <FormLabel>Number of attempts</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the time the assessment will be due." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
 
      <DialogFooter className='w-[300px] md:w-full'>
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