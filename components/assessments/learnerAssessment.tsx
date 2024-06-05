"use client"
import { getAdminAssessment, getLearnerQuestions, getUser, submitQuizResult } from '@/actions/actions';
import React, { useEffect, useState } from 'react'
import ScoreCard from './scoreCard';
import { QueryResultRow } from '@vercel/postgres';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const LearnerAssessment = (
    {classId, assessmentId, attempts, submissionsLength} : {classId: string, assessmentId: string, attempts: string, submissionsLength: any}
) => {

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QueryResultRow[] | undefined>(undefined);

  const [questionsLength, setQuestionsLength] = useState<number | undefined>(0);

  const [question, setQuestion] = useState('');

  const [options, setOptions] = useState<QueryResultRow[] | undefined>(undefined);

    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [answerChecked, setAnswerChecked] = useState(false);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [quizResult, setQuizResult] = useState({
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
    }); 

    const [pass, setPass] = useState<any>(null);
    const [user, setUser] = useState("");

    let currentIndex = 0;

    const fetchQuestions = async () => {
      const result =  await getLearnerQuestions(classId, assessmentId);
      return result;
  };

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

            const fetchedQuestions = await fetchQuestions();
            setQuestions(fetchedQuestions as QueryResultRow[] );
            setQuestionsLength(fetchedQuestions?.length);
            if (fetchedQuestions && fetchedQuestions.length > 0) {
                setQuestion(fetchedQuestions[currentQuestionIndex].question);
                setOptions(fetchedQuestions[currentQuestionIndex].options);
                setCorrectAnswer(fetchedQuestions[currentQuestionIndex].correctanswer);
            }
         } catch (error) {
            console.error('Error fetching questions:', error);
         }
        
      };
      fetchData();
  }, []);
 
    const onAnswerSelected = (answer: any, index: any) => {
        setSelectedAnswerIndex(index);
        setSelectedAnswer(answer);
        setAnswerChecked(true);
    };

    const handleNextQuestion = async() => {
     
        if (selectedAnswer === correctAnswer) {
            setQuizResult((prev) => ({
                ...prev,
                score: prev.score + 1,
                correctAnswers: prev.correctAnswers + 1,
            }));
        } else {
            setQuizResult((prev) => ({
                ...prev,
                wrongAnswers: prev.wrongAnswers + 1,
            }));
        }

        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    
        if (questions?.[currentQuestionIndex + 1] !== undefined) { 
            setQuestion(questions[currentQuestionIndex + 1].question);
            setOptions(questions[currentQuestionIndex + 1].options);
            setCorrectAnswer(questions[currentQuestionIndex + 1].correctanswer);
        } else {
            
            if (!pass) {
                return <div className='flex justify-center items-center'>Loading</div>;
            }
            setShowResults(true);
            const totalQuestions = questions || [];
            const percentage = (quizResult.score / (totalQuestions.length || 1)) * 100;
            const status = percentage >= pass ? 'Pass' : 'Fail';
            const userScore = quizResult.score + " / " + questions?.length;

            const assessment = await getAdminAssessment(classId, assessmentId);
            await submitQuizResult(classId, assessmentId, user, userScore, percentage ,status, assessment?.title);

                setShowResults(true);

        }
    
        setSelectedAnswer('');
        setSelectedAnswerIndex(null);
        setAnswerChecked(false);
    };
    


  return (
    <div className='flex justify-center items-center flex-col gap-8 m-6 md:m-0'>
        {
            questions ? (
                <div>
            <div>
                {!showResults ? (
                    <div>
                    <div className='text-gray-600 text-center text-sm md:text-base w-[350px] md:w-full'>
                        <div>
                        You only have <b>{attempts}</b> attempt(s)  to complete the quiz.
                        <br />
                        This is attempt <b>{submissionsLength + 1} / {attempts}</b>
                        <br />
                        <br />
                        <span className='text-red-600 font-light'>Note: Your last attempt's result will be your final mark.</span>
                        </div>
                    </div>
                    <div className='bg-white border shadow rounded-md p-12 flex flex-col gap-8 w-[350px] md:w-[430px] mt-12'>
                      <div>
                        <h1 className='font-bold'>Question {currentQuestionIndex + 1}</h1>
                        <h4>{question}</h4>
                      </div>
            
                        <RadioGroup defaultValue="option-1" className='flex flex-col gap-4'>
                        {options?.map((option: any, index: any) => (
                            <div 
                                key={index}
                                onClick={() => onAnswerSelected(option,index)}
                                className={
                                    'flex items-center gap-2'
                            }
                            >
                                <div>
                                <RadioGroupItem value={option} id="option-one" className='w-4 h-4'/>
                                </div>
                                <div className=''>
                                <Label htmlFor={`option-${index + 1}`}>{option}</Label>
                                </div>
                            </div>
                        ))}
                        </RadioGroup>

                  
                        <div className='flex justify-between items-center mt-3'>
                            <span className='text-sm font-semibold'>{currentQuestionIndex + 1}/{questionsLength}
                            </span>
                            <button
                                onClick={handleNextQuestion}
                                className='bg-[#064789] hover:border hover:border-[#064789] hover:text-[#064789] text-white rounded-md p-0.5 hover:cursor-pointer px-3 hover:bg-white'
                                disabled={!answerChecked}
                            >
                               {currentQuestionIndex === (questionsLength !== undefined ? questionsLength - 1 : 0) ?
                                  'Submit' : 'Next'}
                            </button>
                        </div>
                    </div>
                    </div>
                ) : (
                    <ScoreCard
                        quizResult = {quizResult}
                        questions = {questions}
                        classId = {classId}
                        assessmentId = {assessmentId}
                    />
                )}
            </div>
                </div>
            ) : (
                <div className="blue-loader"></div>
            )
        }
        </div>
  )
}

export default LearnerAssessment