import { getAdminAssessment, getUser, submitQuizResult } from '@/actions/actions';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';

const ScoreCard = ({ quizResult, questions, classId, assessmentId}: {quizResult: any, questions: any, classId: string, assessmentId: string}) => {
	const [pass, setPass] = useState<any>(null);
    const [user, setUser] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const assessment = await getAdminAssessment(classId, assessmentId);
                setPass(assessment?.passpercentage);

                const currentUser = await getUser();
                const userName = currentUser?.firstname;
                const userSurname = currentUser?.lastname;
                const userFullname = userName + " " + userSurname;
                setUser(userFullname);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (!pass) {
        return <div className='flex justify-center items-center'>Loading</div>;
    }

    const percentage = (quizResult.score / questions.length) * 100;
    const status = percentage >= pass ? 'Pass' : 'Fail';
	const userScore = quizResult.score + " / " + questions.length;

    const submitResults = async () => {
        try {
            const assessment = await getAdminAssessment(classId, assessmentId);
            await submitQuizResult(classId, assessmentId, user, userScore, percentage ,status, assessment?.title);
        } catch (error) {
            console.error('Error submitting quiz results:', error);
        }
    };


	return (
		<div className='bg-white border shadow rounded-md p-12 py-8 mt-6'>
			<div className='flex flex-col gap-8'>
				<div>
					<h1 className='font-bold text-2xl'>Results</h1>
					<h3 className='text-gray-600 text-sm'> Here are your results from the quiz.</h3>
				</div>
				<table className='table'>
					<tbody className='flex flex-col gap-2'>
						<tr className='flex justify-between border-b pb-2'>
							<td className='font-medium'>Total Questions : </td>
							<td>{questions.length}</td>
						</tr>
						<tr className='flex justify-between border-b pb-2'>
							<td className='font-medium'>Total Score : </td>
							<td>{quizResult.score}</td>
						</tr>
						<tr className='flex justify-between border-b pb-2'>
							<td className='font-medium'>Correct Answers : </td>
							<td>{quizResult.correctAnswers}</td>
						</tr>
						<tr className='flex justify-between border-b pb-2'>
							<td className='font-medium'>Wrong Answers : </td>
							<td>{quizResult.wrongAnswers}</td>
						</tr>
						<tr className='flex justify-between border-b pb-2'>
							<td  className='font-medium'>Percentage : </td>
							<td>{percentage}%</td>
						</tr>
						<tr className='flex justify-between '>
							<td className='font-medium'>Status : </td>
							<td>{status}</td>
						</tr>
					</tbody>
				</table>

				<div className='grid w-full mt-4'>
					<Link href={`/classes/${classId}/assessments`} className='place-self-end'>
					<Button
					onClick={submitResults}
					className='flex gap-2 items-center bg-[#064789] hover:border hover:border-[#064789] hover:bg-white hover:text-[#064789]'
					>
						<FaArrowLeft />
						<span>Assessments</span>
					</Button>
				</Link>
				</div>
			</div>
		</div>
	);
};

export default ScoreCard;
