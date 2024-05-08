"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BsPaperclip } from "react-icons/bs";
import axios from "axios";
import { addPdfQuestion } from '@/actions/actions';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from '../provider';
import { document } from 'postcss';
import { Button } from '../ui/button';

const AddAssignment = ({classId, assessmentId}: {classId: string, assessmentId: string}) => {

    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [downloadUrl, setDownloadUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!pdfFile || !classId || !assessmentId) {
        throw new Error('Please select a PDF file.');
      }

      const fileRef = ref(storage, `files/${pdfFile.name}`);
      const uploadTask = uploadBytesResumable(fileRef, pdfFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        }
      ), (error: any) => {
        console.log("ERROR UPLOADING FILE: ", error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setDownloadUrl(downloadUrl);
        })
      }

      await addPdfQuestion(pdfFile?.name, classId, assessmentId);
    }catch(err){
        throw new Error('Pdf upload failed. Please try again.');
    }
  };


  return (
    <Dialog>
    <DialogTrigger asChild className='hover:cursor-pointer hover:bg-gray-100 w-full p-2 rounded-md flex items-center gap-2'>
      <div className='grow text-sm'>
        <BsPaperclip />
        <span>Written assignment</span>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create a new quiz</DialogTitle>
        <DialogDescription>Enter all the information. Click create when you're done.</DialogDescription>
    </DialogHeader>
    <div>
        <label htmlFor="pdfFile">Upload PDF</label>
        <input type="file" id="pdfFile" onChange={handleFileChange} accept=".pdf" className='p-2 rounded bg-gray-600'/>
    </div>
    <Button onClick={handleSubmit}>Add PDF Question</Button>
    </DialogContent>
  </Dialog>
  )
}

export default AddAssignment