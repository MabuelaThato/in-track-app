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
import { addPdfQuestion } from '@/actions/actions';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from '../provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

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
        <DialogDescription>
          Click 'choose file' and select the pdf assignment you would like to upload.
          <br />
          <br />
          Ensure that the name of pdf file is in this format: "your name-name of test-year", 
          <br />
          eg."ThatoMabuela-Photosynthesis-2024"
        </DialogDescription>
    </DialogHeader>
    <div>
        <Input type="file" id="pdfFile" onChange={handleFileChange} accept=".pdf" className=''/>
    </div>
    <Button onClick={handleSubmit}>Add PDF Question</Button>
    </DialogContent>
  </Dialog>
  )
}

export default AddAssignment