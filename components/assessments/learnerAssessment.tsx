"use client"
import { getAdminAssessment, getLearnerQuestions } from '@/actions/actions';
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

    const fetchQuestions = async () => {
      const result =  await getLearnerQuestions(classId, assessmentId);
      return result;
  };

    useEffect(() => {
      const fetchData = async () => {
          const fetchedQuestions = await fetchQuestions();
          setQuestions(fetchedQuestions as QueryResultRow[]);
          setQuestionsLength(fetchedQuestions?.length);
          if (fetchedQuestions && fetchedQuestions.length > 0) {
            setQuestion(fetchedQuestions ? fetchedQuestions[currentQuestionIndex].question : '');
              setOptions(fetchedQuestions[currentQuestionIndex].options);
              setCorrectAnswer(fetchedQuestions[currentQuestionIndex].correctanswer);
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
              score: prev.score + 5,
              correctAnswers: prev.correctAnswers + 1,
          }));
      } else {
          setQuizResult((prev) => ({
              ...prev,
              wrongAnswers: prev.wrongAnswers + 1,
          }));
      }
      if (currentQuestionIndex !== (questionsLength !== undefined ? questionsLength - 1 : 0)) {
          setCurrentQuestionIndex((prev) => prev + 1);
      } else {
          setShowResults(true);
      }
      setSelectedAnswer('');
      setSelectedAnswerIndex(null);
      setAnswerChecked(false);
  };

  const getPassPercentage = async () => {
    const assessment = await getAdminAssessment(classId, assessmentId);
    const passPercentage = assessment.passpercentage;
    return passPercentage;
  }

  const passPercentage = getPassPercentage();

  return (
    <div className=''>
 
            <div>
                {!showResults ? (
                    <div className='bg-white rounded-md p-12'>
                      <h1 className='font-bold'>Question {currentQuestionIndex + 1}</h1>
                        <h4>{question}</h4>
                        {/*<ul className='list-group'>
                            {options?.map((option: any, index: any) => (
                                <li
                                    key={index}
                                    onClick={() => onAnswerSelected(option,index)}
                                    className={
                                        'list-group-item ' +
                                        (selectedAnswerIndex === 
                                                index ? 'active' : '') +
                                        ' cursor-pointer'
                                    }
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>*/}
                        <RadioGroup defaultValue="option-one">
                        {options?.map((option: any, index: any) => (
                            <div 
                                key={index}
                                onClick={() => onAnswerSelected(option,index)}
                                className={
                                    'flex items-center space-x-2 ' +
                                    (selectedAnswerIndex === 
                                            index ? 'active' : '') +
                                    ' cursor-pointer'
                            }
                            >
                                <RadioGroupItem value={option} id="option-one" />
                                <Label htmlFor={`option ${index}`}>{option}</Label>
                            </div>
                        ))}
                        </RadioGroup>

                  
                        <div className='flex justify-between mt-3'>
                            <b>Question
                                {currentQuestionIndex + 1}/{questionsLength}
                            </b>
                            <button
                                onClick={handleNextQuestion}
                                className='btn btn-primary'
                                disabled={!answerChecked}
                            >
                               {currentQuestionIndex === (questionsLength !== undefined ? questionsLength - 1 : 0) ?
                                  'Submit' : 'Next Question'}
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
  )
}

export default LearnerAssessment