'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/QuizContext';
import { QuizQuestion } from '@/components/QuizQuestion';
import { quizSteps } from '@/lib/quizData';
import { Navbar } from '@/components/Navbar';

export default function QuizStep2Page() {
  const router = useRouter();
  const { state, addAnswer, nextStep, prevStep } = useQuiz();
  
  const currentQuizStep = quizSteps.find(step => step.step === 2);
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [canProceed, setCanProceed] = useState(false);

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

  // Check if all questions are answered
  useEffect(() => {
    const allAnswered = currentQuizStep?.questions.every(question => {
      const answer = answers[question.id];
      if (answer === undefined) return false;
      
      if (question.type === 'text') return true;
      if (question.type === 'multi-select') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== '' && answer !== undefined;
    }) || false;
    setCanProceed(allAnswered);
  }, [answers, currentQuizStep]);

  if (!currentQuizStep) {
    router.push('/');
    return null;
  }

  const handleAnswer = (questionId: string, answer: string | number | string[]) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    addAnswer({ questionId, answer });
  };

  const handleNext = () => {
    nextStep();
    router.push('/quiz/step-3');
  };

  const handlePrev = () => {
    prevStep();
    router.push('/quiz/step-1');
  };

  const progress = (2 / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />

      <div className="px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">Step 2 of 4</p>
        </div>
      </div>

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentQuizStep.title}</h2>
              <p className="text-gray-600">{currentQuizStep.description}</p>
            </div>

            <div className="space-y-8">
              {currentQuizStep.questions.map((question) => (
                <QuizQuestion
                  key={question.id}
                  question={question}
                  onAnswer={(answer) => handleAnswer(question.id, answer)}
                  currentAnswer={answers[question.id]}
                />
              ))}
            </div>

            <div className="flex justify-between mt-12">
              <button
                onClick={handlePrev}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  canProceed
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 