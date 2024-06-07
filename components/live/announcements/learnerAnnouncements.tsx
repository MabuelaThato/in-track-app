'use client'
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAnnouncements } from '@/actions/communications';

interface Announcement {
  announcementid: string;
  title: string;
  details: string;
  day: string;
}

interface AnnouncementsProps {
  classId: string;
}

const LearnerAnnouncements: React.FC<AnnouncementsProps> = ({ classId }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const fetchedAnnouncements = await getAnnouncements(classId) as Announcement[] | undefined;
      
      fetchedAnnouncements?.sort((a, b) => {
        const getDate = (day: string) => {
          const parts = day.split('-');
          const dayDate = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const year = parseInt(parts[2]);
          return new Date(year, month, dayDate);
        };

        const dateA = getDate(a.day);
        const dateB = getDate(b.day);

        return dateB.getTime() - dateA.getTime();
      });

      setAnnouncements(fetchedAnnouncements || []);
    };

    fetchAnnouncements();
  }, [classId]);

  return(
<div className='flex flex-wrap gap-8'>
  
  {
    announcements?.map((announcement, index) => {
          return (
            <Card key={index} className='md:w-80 flex flex-col'>
              <CardHeader>
                <CardTitle>
                  <div>
                    <div>{announcement?.title}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='text-gray-600'>
                <p>{announcement.details}</p>
              </CardContent>
            </Card>
          )
        }
      )}
      </div>
  )}

  export default LearnerAnnouncements;