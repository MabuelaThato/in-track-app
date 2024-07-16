'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";  
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { QueryResultRow } from '@vercel/postgres';
import { getClassLearners, getToken, getUser } from '@/actions/actions';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '@/components/provider';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa6';

const formSchema = z.object({
    person: z.object({
      name: z.string(),
      surname: z.string(),
      learnerid: z.string(),
    }),
  })

const AddChatRoom = ({classId}: {classId: string}) => {

    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          person: {},
        },
      })

    const [learners, setLearners] = useState<QueryResultRow>([]);

    useEffect(() => {
        const fetchUserAndLearners = async () => {
            const user = await getToken();
            const getUserData = await getUser();
            setUser(user);
            setUserData(getUserData);
            const learners = await getClassLearners(classId);
            setLearners(learners || []);
        };

        fetchUserAndLearners();
    }, [classId]);

    learners?.sort((a: any, b: any) => {
        if (a.surname < b.surname) return -1;
        if (a.surname > b.surname) return 1;
        return 0;
      });

      async function onSubmit(values: z.infer<typeof formSchema>) {
        setUploading(true);
        const selectedLearner = values.person;
        const { learnerid, name, surname } = selectedLearner;

        const existingChatroom = query(collection(db, 'chatrooms'),where('classId', '==', classId), where('users','==',[user, learnerid]));

        try {
            const existingChatroomSnapshot = await getDocs(existingChatroom);
    
            if (!existingChatroomSnapshot.empty) {
                toast.error('Chat already exists.');
                return;
            }
    
            const chatRoomData = {
                users: [
                  {
                    id:user,
                    userName: userData.firstname + ' ' + userData.lastname
                  }
                  , {
                    id: learnerid,
                    userName: name + ' ' + surname
                  }
                  ],
                  userIds: [user, learnerid],
                timeStamp: serverTimestamp(),
                lastMessage: null,
                classId: classId,
            };
    
            await addDoc(collection(db, 'chatrooms'), chatRoomData);
    
            toast.success('Chat created successfully');
            window.location.reload();
        } catch (err) {
            console.error('Error creating chat:', err);
            toast.error('Failed to create chat');
            setUploading(false)
        }
      }

  return (
    <Dialog>
      <DialogTrigger asChild className='text-xs md:text-sm lg:text-base hover:cursor-pointer border border-[#A5BE00] bg-[#A5BE00] text-white hover:bg-white hover:text-[#A5BE00] rounded-md py-1.5 p-2 rounded-md flex items-center justify-center w-32 gap-2'>
           <div>
            <FaPlus />
            <span>Add Chat</span>
           </div>
      </DialogTrigger>
      <DialogContent className="w-[330px] md:w-[450px] rounded-md">
        <DialogHeader>
          <DialogTitle>Create a chat</DialogTitle>
          <DialogDescription>
            Select the person you would like to create a chat with.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="person"
          render={({ field }) => (
            <FormItem className='w-[280px] md:w-full'>
              <Select onValueChange={(value) => field.onChange(JSON.parse(value))} defaultValue={JSON.stringify(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the person you would like to create a chat with." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                    learners.filter((learner: any) => learner.learnerid !== user)
                    .map((learner: any) =>{
                        return (
                        <SelectItem key={learner.learnerid} value={JSON.stringify(learner)}>{learner.name} {learner.surname}</SelectItem>
                        )
                    })
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">
            {
                uploading ? (<div>Creating...</div>) : (<div>Create chat</div>)
            }
          </Button>
        </DialogFooter>
        </form>
    </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddChatRoom
