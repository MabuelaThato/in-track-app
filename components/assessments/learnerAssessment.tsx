"use client"
import { getLearnerQuestions } from '@/actions/actions';
import React, { useEffect, useState } from 'react'
import ScoreCard from './scoreCard';
import { QueryResultRow } from '@vercel/postgres';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const LearnerAssessment = ({classId, assessmentId}: {classId: string, assessmentId: string}) => {

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

    let currentIndex = 0;

    const fetchQuestions = async () => {
      const result =  await getLearnerQuestions(classId, assessmentId);
      return result;
  };

    useEffect(() => {
      const fetchData = async () => {
         try {
            const fetchedQuestions = await fetchQuestions();
            setQuestions(fetchedQuestions as QueryResultRow[]);
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

    const handleNextQuestion = () => {
     
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

            setShowResults(true);
        }
    
        setSelectedAnswer('');
        setSelectedAnswerIndex(null);
        setAnswerChecked(false);
    };
    


  return (
    <div className='flex justify-center flex-col gap-8'>
        {
            questions ? (
                <div>
                    <div className='text-gray-600 text-center'>You only have <b>one</b> attempt  to complete the quiz.</div>
            <div>
                {!showResults ? (
                    <div className='bg-white border shadow rounded-md p-12 flex flex-col gap-8 w-96'>
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
                                    'flex items-center space-x-2'
                            }
                            >
                                <RadioGroupItem value={option} id="option-one" />
                                <Label htmlFor={`option-${index + 1}`}>{option}</Label>
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