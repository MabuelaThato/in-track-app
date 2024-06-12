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

const AddAssignment = ({classId, assessmentId}: {classId: string, assessmentId: string}) => {

    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [uploading, setUploading] = useState(false)

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

      const fileRef = ref(storage, `files/${classId}/${pdfFile.name}`);
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
      setUploading(true);
      window.location.reload();
    }catch(err){
        throw new Error('Pdf upload failed. Please try again.');
    }
  };


  return (
    <Dialog>
    <DialogTrigger asChild className='hover:cursor-pointer p-1 px-2 text-white rounded-md bg-[#A5BE00] border border-[#A5BE00] hover:text-[#A5BE00] font-medium hover:bg-white'>
      <div className='flex items-center gap-2'>
        <BsPaperclip />
        <span>Assignment</span>
      </div>
    </DialogTrigger>
    <DialogContent className="max-w-[350px] md:max-w-[425px] rounded"> 
      <DialogHeader>
        <DialogTitle>Create a new assignment</DialogTitle>
        <DialogDescription>
          Click 'choose file' and select the pdf assignment you would like to upload.
          <br />
          <br />
          Ensure that the name of pdf file is in this format: "name of test"-"year", 
          <br />
          eg."PhotosynthesisAssignment-2024"
          <br />
          <br />
          Please make sure that your pdf is not bigger than 7MB.
        </DialogDescription>
    </DialogHeader>
    <div>
        <Input type="file" id="pdfFile" onChange={handleFileChange} accept=".pdf" className='mt-2'/>
    </div>
    <Button onClick={handleSubmit} disabled={uploading}>
      {
        uploading ? (<div>Adding...</div>) : (<div>Add PDF Question</div>)
      }
    </Button>
    </DialogContent>
  </Dialog>
  )
}

export default AddAssignment