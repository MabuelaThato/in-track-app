import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClassLearners, getToken } from '@/actions/actions';
import { QueryResultRow } from '@vercel/postgres';

const ChatList = ({classId}:{classId: string}) => {
  
    async function GetToken(){
        const token = await getToken();

        return token;
    }

    const user = GetToken();
  const [learners, setLearners] = useState<QueryResultRow>([]);

  useEffect(() => {

    const fetchLearners = async () => {
      const learners = await getClassLearners(classId);
      setLearners(learners || []);
    };
    fetchLearners();
  }, [user]);

  return (
    <div>
      <h1>Classes</h1>
      <ul>
        {learners.map((learner: any) => (
          <li key={learner.learnerid}>
            <Link href={`/live/chat/${learner.learnerid}`}>
              <a>{learner.name} {learner.surname}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;