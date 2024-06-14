'use client'
import React, { Ref, forwardRef, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { db, storage } from "@/components/provider";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FaImage, FaPaperPlane } from "react-icons/fa6";
import { BsEmojiLaughing, BsEmojiLaughingFill, BsEmojiSunglasses } from "react-icons/bs";
import EmojiPicker from 'emoji-picker-react';
import moment from 'moment';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";

const ForwardedFaImage = forwardRef<HTMLDivElement, any>((props, ref: Ref<HTMLDivElement>) => {
  return (
    <div ref={ref} {...props}>
      <FaImage />
    </div>
  );
});


const ChatRoom = ({ roomId, userId }: {roomId: string, userId: string}) => {
  
  const [file, setFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
  const [image, setImage] = useState<any>('');
  const [message, setMessage] = useState<any>('');
  const [messages, setMessages] = useState<any>([]);
  const messagesContainerRef = useRef<any>(null);

  useEffect(() => {

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);


useEffect(() => {
  if(!roomId) return;
  const unsubscribe = onSnapshot(
    query(collection(db, 'messages'),where("chatRoomId","==",roomId),orderBy('time', 'asc')),
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(messages);
    }
  );

  return unsubscribe;
}, [roomId]);


 const sendMessage = async () => {

  console.log(image)
    const messagesCollection = collection(db, 'messages');

  if (message == '' && image == '') {
    return;
  }

  try {

    const newMessage = {
      chatRoomId:roomId,
      sender: userId,
      content: message,
      time: serverTimestamp(),
      image: image,
    };

    await addDoc(messagesCollection, newMessage);
    const chatroomRef = doc(db, 'chatrooms', roomId);
    setMessage('');
    setImage('');
    
    await updateDoc(chatroomRef, { lastMessage: message ? message : "Image" });
  } catch (error) {
    console.error('Error sending message:', error);
  }

  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }
    
}

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {

    if (!file) {
      console.error('No file selected.');
      return;
    }

    const storageRef = ref(storage, `images/${roomId}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading file:', error.message);
      },
      () => {

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
 
          setFile(null);
          setImage(downloadURL);

          setImagePreview(null);
          const modal = document.getElementById('dialog');
          if (modal && typeof (modal as any).close === 'function') {
            (modal as any).close();
          }
        });
        
      
      }
    );

  };

  const handleEmojiClick = (emojiData: any, event: any) => {
    event.preventDefault();
    setMessage((prevMessage: any) => prevMessage + emojiData.emoji);
    const modal = document.getElementById('emoji-picker');
    if (modal && typeof (modal as any).close === 'function') {
      (modal as any).close();
    }
  }

  const formatTimeAgo = (timestamp: any) => {
    const date = timestamp?.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  };


  return (
  <div className="w-full h-full flex flex-col gap-4">

    {/*MESSAGES */}


     <div ref={messagesContainerRef} className='h-4/5 flex-1 overflow-y-auto mt-6 p-10 h-2/4 w-full bg-white border border-gray-200 rounded-lg'>
      {messages?.map((message: any) => (
        <div key={message.id} className={`flex mb-4 ${message.sender === userId ? 'justify-end' : 'justify-start'}`}>
  

        <div className={` text-white p-2 rounded-md ${message.sender === userId ? 'bg-[#064789] self-end' : 'bg-[#A5BE00] self-start'}`}>
          {
            message.image && <a href={message.image} download target='blank'>
              <img src={message.image} className='max-h-60 w-60 mb-4' alt="user-image" />
            </a>
          }
          <p>{message.content}</p>
          <div className='text-xs text-gray-200'>{formatTimeAgo(message.time)}</div>
        </div>
      </div>
      ))}
    </div>


    {/*MESSAGE INPUT */}


    <div className='relative flex items-center py-2 px-6 rounded-full text-gray-500 justify-end bg-white mb-6 text-lg'>
      <Dialog>
        <DialogTrigger asChild className={`${image ? "text-[#064789]":"text-gray-500"} mr-2 cursor-pointer`}>
          <ForwardedFaImage />
        </DialogTrigger>
        <DialogContent id="dialog" className="w-[300px] md:w-[350px] rounded">
          <DialogHeader className="w-full">
            <DialogTitle>Image upload</DialogTitle>
            <DialogDescription className="w-full">
              After upload progress is 100% you can close this dialogue, your image will be sent with your message.
            </DialogDescription>
          </DialogHeader>
          <form method='dialog' className="flex flex-col gap-4 justify-center">
            {imagePreview && <img src={imagePreview} alt='Uploaded' className='max-h-60 w-60 mb-4' />}
            <input type='file' accept='image/*' onChange={handleFileChange} className="w-full"/>
            <Button onClick={()=>{handleUpload()}} className="w-full">
              Upload
            </Button>
            <div>
              <div className="flex gap-4">
                <p>Upload progress: </p> 
                <span>
                  {
                    uploadProgress == 100 ? 'Done' : ''
                  }
                </span>
              </div>
              <progress value={uploadProgress} max='100' className="w-full"></progress>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      
      <BsEmojiLaughingFill 
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      className="mr-2 cursor-pointer"
      />

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type='text'
        placeholder='Type a message...'
        className='flex-1 border-none p-2 outline-none ml-4 text-base'
      />

      <span onClick={() => sendMessage()} className='cursor-pointer ml-2 text-[#064789]' >
        <FaPaperPlane />
      </span>

      {showEmojiPicker && (
        <div className='absolute right-0 bottom-full p-2' id="emoji-picker">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  </div>
  );
};

export default ChatRoom;