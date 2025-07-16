'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/QuizContext';
import { QuizQuestion } from '@/components/QuizQuestion';
import { quizSteps } from '@/lib/quizData';
import { Navbar } from '@/components/Navbar';

export default function QuizStep4Page() {
  const router = useRouter();
  const { state, addAnswer, nextStep } = useQuiz();
  
  const currentQuizStep = quizSteps.find(step => step.step === 4);
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [canProceed, setCanProceed] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Initialize answers from existing state
  useEffect(() => {
    const existingAnswers: Record<string, string | number | string[]> = {};
    currentQuizStep?.questions.forEach(question => {
      const existingAnswer = state.answers.find(a => a.questionId === question.id);
      if (existingAnswer) {
        existingAnswers[question.id] = existingAnswer.answer;
      }
    });
    setAnswers(existingAnswers);
  }, [currentQuizStep, state.answers]);

  // Check if current question is answered
  useEffect(() => {
    if (!currentQuizStep) return;
    
    const currentQuestion = currentQuizStep.questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const answer = answers[currentQuestion.id];
    let isAnswered = false;
    
    if (answer === undefined) {
      isAnswered = false;
    } else if (currentQuestion.type === 'text') {
      isAnswered = true; // Text questions are optional
    } else if (currentQuestion.type === 'multi-select') {
      isAnswered = Array.isArray(answer) && answer.length > 0;
    } else if (typeof answer === 'string' && answer === 'Other') {
      // If "Other" is selected but no text provided, not answered
      isAnswered = false;
    } else if (typeof answer === 'string' && answer.startsWith('Other: ')) {
      // If "Other: text" is provided, check if text is not empty
      isAnswered = answer.replace('Other: ', '').trim().length > 0;
    } else {
      isAnswered = answer !== '' && answer !== undefined;
    }
    
    setCanProceed(isAnswered);
  }, [answers, currentQuestionIndex, currentQuizStep]);

  if (!currentQuizStep) {
    router.push('/');
    return null;
  }

  const handleAnswer = (questionId: string, answer: string | number | string[]) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    // Save to context
    addAnswer({ questionId, answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuizStep.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      nextStep();
      router.push('/results');
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      router.push('/quiz/step-3');
    }
  };

  const currentQuestion = currentQuizStep.questions[currentQuestionIndex];
  const progress = (75 + ((currentQuestionIndex + 1) / currentQuizStep.questions.length) * 25); // 75-100% for step 4 of 4

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step 4 of 4</span>
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {currentQuizStep.questions.length}
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Display */}
      <div className="flex-1 py-8">
        <QuizQuestion
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
          currentAnswer={answers[currentQuestion.id]}
        />

        {/* Navigation */}
        <div className="fixed bottom-8 right-8 z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrev}
              className="px-6 py-3 bg-white border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium shadow-lg"
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-8 py-3 rounded-full font-semibold transition-all shadow-lg ${
                canProceed
                  ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white hover:from-orange-500 hover:to-pink-500 transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentQuestionIndex < currentQuizStep.questions.length - 1 ? 'Next' : 'Get Results'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 