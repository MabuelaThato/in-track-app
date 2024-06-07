"use client"
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { storage } from '../provider';
import { GetNotes, deleteNote } from '@/actions/resourcesActions';
import { getUser } from '@/actions/actions';
import { FaFilePdf } from 'react-icons/fa6';

interface Note {
    noteid: string;
    filename: string;
    date: string;
  }
  
  interface CustomQueryResultRow {
    noteid: string;
    filename: string;
  }

  interface PdfNotesProps {
    classId: string;
    userRole: string;
  }

const PdfNotes: React.FC<PdfNotesProps> = ({ classId, userRole }) => {
    const [notes, setNotes] = useState<Note[]>([]);
  const [downloadUrls, setDownloadUrls] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchNotes = async () => {
            const user = await getUser();
            const userRole = user?.role;
            const fetchedNotes = await GetNotes(classId) as CustomQueryResultRow[] | undefined;
            const notesArray: Note[] = (fetchedNotes || []).map((row) => ({
                noteid: row.noteid,
                filename: row.filename,
                date: row.date,
              }));

              notesArray.sort((a, b) => {
                const getDate = (date: string) => {
                  const parts = date.split('-');
                  const day = parseInt(parts[0]);
                  const month = parseInt(parts[1]) - 1;
                  const year = parseInt(parts[2]);
                  return new Date(year, month, day);
                };
        
                const dateA = getDate(a.date);
                const dateB = getDate(b.date);
        
                return dateB.getTime() - dateA.getTime();
              });
        
              setNotes(notesArray);

            const urls: { [key: string]: string } = {};
            for (const note of notesArray) {
                try {
                const pathReference = ref(storage, `notes/${classId}/${note.filename}`);
                const url = await getDownloadURL(pathReference);
                urls[note.noteid] = url;
                } catch (error) {
                console.error('Error getting download URL for note:', note.filename, error);
                }
            }

            setDownloadUrls(urls);
        }

        fetchNotes();
    }, [classId]);

    async function handleDelete(noteId: any, fileName: any) {
        try {
            await deleteNote(classId, noteId);
            const desertRef = ref(storage, `notes/${classId}/${fileName}`);

            await deleteObject(desertRef);
            console.log("FILE DELETED SUCCESSFULLY");
            
            setNotes(notes.filter(note => note.noteid !== noteId));
            const newDownloadUrls = { ...downloadUrls };
            delete newDownloadUrls[noteId];
            setDownloadUrls(newDownloadUrls);
        } catch (error) {
            console.error("ERROR DELETING: ", error);
        }
    }

    const notesLength = notes?.length;

    return (
        <div>
            {
                notesLength === 0 ? (
                    <div className='flex h-screen justify-centertext-center text-zinc-500 flex justify-center items-center h-screen'>
                        You do not have any notes.
                    </div>
                ): (
                    <div className='flex flex-col md:flex-row md:flex-wrap mt-6 gap-6'>
            {notes.map(note => (
                <div key={note.noteid} className='w-full md:w-96'>
                    {downloadUrls ? (
                        <div className=''>
                            <a href={downloadUrls[note.noteid]} 
                            download={note.filename} 
                            target='_blank' 
                            className='border flex rounded shadow min-h-20 bg-white hover:cursor-pointer'
                            >
                                <div className='p-2 md:p-4 flex items-center justify-center'>
                                    <FaFilePdf size={32} color='red' />
                                </div>
                                <div className='border-l p-2 md:p-4 flex items-center justify-center'>
                                    <div>{note.filename}</div>
                                </div>
                            </a>
                            {userRole === 'admin' ? (
                                <button 
                                onClick={() => handleDelete(note.noteid, note.filename)}
                                className='ml-1 mt-1 underline text-sm'
                                >
                                    Delete
                                </button>
                            ) : ("")}
                        </div>
                    ) : (
                        <div className='blue-loader'></div>
                    )}
                </div>
            ))}
        </div>
                )
            }
        </div>
    );
};

export default PdfNotes;
