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
import { getAdminAssessment, submitPdfAnswer } from '@/actions/actions';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from '../provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const PdfSubmission = ({classId, assessmentId}: {classId: string, assessmentId: string}) => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [uploading, setUploading] = useState(false);

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

      const fileRef = ref(storage, `learners/${pdfFile.name}`);
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

      const currentAssessment = await getAdminAssessment(classId, assessmentId);
      const assessmentTitle = currentAssessment?.title;

      await submitPdfAnswer(pdfFile?.name, classId, assessmentId, assessmentTitle);
      setUploading(true);
      window.location.reload();
    }catch(err){
        throw new Error('Pdf upload failed. Please try again.');
    }
  };


  return (
    <Dialog>
    <DialogTrigger asChild className='p-2 rounded-md flex items-center justify-end gap-1 hover:cursor-pointer hover:underline'>
      <div className='grow text-sm'>
        <BsPaperclip />
        <span>Submit assignment</span>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]"> 
      <DialogHeader>
        <DialogTitle>Assignment Submission</DialogTitle>
        <DialogDescription>
          Click 'choose file' and select the pdf assignment you would like to upload.
          <br />
          <br />
          Ensure that the name of pdf file is in this format: "your name"-"name of assignment"-"year", 
          <br />
          eg."ThatoMabuela-Photosynthesis-2024"
          <br />
          <br />
          Please make sure that your pdf is not bigger than 7MB.
        </DialogDescription>
    </DialogHeader>
    <div>
        <Input type="file" id="pdfFile" onChange={handleFileChange} accept=".pdf" className='hover:cursor-pointer mt-1'/>
    </div>
    <Button onClick={handleSubmit} disabled={uploading}>
      {
        uploading ? (
          <div>Submitting...</div>
        ) : (
          <div>Submit assignment</div>
        )
      }
    </Button>
    </DialogContent>
  </Dialog>
  )
}

export default PdfSubmission