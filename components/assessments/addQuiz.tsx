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
import { MdOutlineQuiz } from "react-icons/md";

const formSchema = z.object({
    title: z.string().min(2).max(50),
    instruction: z.string().min(2),
  })

const AddQuiz = ({classId}: {classId: string}) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
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

      }

  return (
    <Dialog>
    <DialogTrigger asChild className='bg-[#064789] hover:border hover:cursor-pointer hover:border-[#064789] hover:text-[#064789] hover:bg-white rounded-md p-2 text-white flex gap-2 items-center'>
      <div>
        <FaPlus />
        <span className='grow text-sm'>Add assessment</span>
      </div>
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
        <Button type="submit">Create assessment</Button>
      </DialogFooter>
      </form>
    </Form>
    </DialogContent>
  </Dialog>
  )
}

export default AddQuiz