import { getAdminAssessment } from '@/actions/actions';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

const ScoreCard = ({ quizResult, questions, classId, assessmentId}: {quizResult: any, questions: any, classId: string, assessmentId: string}) => {

	const [pass, setPass] = useState<any>(null);

	useEffect(() => {
	  const fetchPassPercentage = async () => {
		try {
		  const passValue = await getAdminAssessment(classId, assessmentId); // Assuming getAdminAssessment returns a promise
		  setPass(passValue.passpercentage);
		} catch (error) {
		  console.error('Error fetching pass percentage:', error);
		}
	  };
  
	  fetchPassPercentage();
	}, []);
  
	if (!pass) {
	  return <div className='flex justify-center items-center'>Loading</div>; // You can add a loading indicator while waiting for the pass percentage
	}
  
	const percentage = (quizResult.score / (questions.length * 5)) * 100;
	const status = percentage >= pass ? 'Pass' : 'Fail';

	return (
		<div>
			<div className=' p-4'>
				<h3> Here are your results from the quiz.</h3>
				<table className='table'>
					<tbody>
						<tr>
							<td>Total Questions:</td>
							<td>{questions.length}</td>
						</tr>
						<tr>
							<td>Total Score:</td>
							<td>{quizResult.score}</td>
						</tr>
						<tr>
							<td>Correct Answers:</td>
							<td>{quizResult.correctAnswers}</td>
						</tr>
						<tr>
							<td>Wrong Answers:</td>
							<td>{quizResult.wrongAnswers}</td>
						</tr>
						<tr>
							<td>Percentage:</td>
							<td>{percentage}%</td>
						</tr>
						<tr>
							<td>Status:</td>
							<td>{status}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<Link href={`/dashboard/classes/${classId}/assessments`}>
				<Button>Assessments</Button>
			</Link>
		</div>
	);
};

export default ScoreCard;
