'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/QuizContext';
import { QuizQuestion } from '@/components/QuizQuestion';
import { quizSteps } from '@/lib/quizData';
import { Navbar } from '@/components/Navbar';

export default function QuizStep3Page() {
  const router = useRouter();
  const { state, addAnswer, nextStep, prevStep } = useQuiz();
  
  const currentQuizStep = quizSteps.find(step => step.step === 3);
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

  // Check if we can proceed
  useEffect(() => {
    if (!currentQuizStep) return;
    
    const allAnswered = currentQuizStep.questions.every(question => {
      const answer = answers[question.id];
      if (question.type === 'multi-select') {
        return Array.isArray(answer) && answer.length > 0;
      }
      if (question.type === 'text') {
        return true; // Text questions are optional
      }
      return answer !== undefined && answer !== '' && answer !== 'other';
    });
    
    setCanProceed(allAnswered);
  }, [answers, currentQuizStep]);

  const handleAnswer = (questionId: string, answer: string | number | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    addAnswer({ questionId, answer });
  };

  const handleNext = () => {
    if (canProceed) {
      nextStep();
      router.push('/quiz/step-4');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      prevStep();
      router.push('/quiz/step-2');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (currentQuizStep?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (!currentQuizStep) {
    return (
      <div className="min-h-screen nature-bg">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="gamified-card p-8 text-center">
            <div className="text-4xl mb-4 cute-illustration">🌱</div>
            <p className="text-gray-600">Loading quiz questions...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuizStep.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuizStep.questions.length) * 100;

  return (
    <div className="min-h-screen nature-bg">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="gamified-card p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-4xl cute-illustration">🎭</span>
              <h1 className="text-2xl sm:text-3xl font-bold">Step 3: Your Personality</h1>
            </div>
            <p className="text-purple-100 text-sm sm:text-base">
              Discover your communication style and creative preferences
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="gamified-card p-4 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">
                {currentQuestionIndex + 1} of {currentQuizStep.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <QuizQuestion
            question={currentQuestion}
            onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
            currentAnswer={answers[currentQuestion.id]}
          />
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            onClick={handlePrevious}
            className="btn btn-secondary px-6 py-3 rounded-full font-medium hover:scale-102"
          >
            <span className="mr-2">←</span>
            Previous
          </button>

          <div className="flex items-center space-x-4">
            {/* Question Navigation Dots */}
            <div className="flex space-x-2">
              {currentQuizStep.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentQuestionIndex
                      ? 'bg-purple-500 scale-125'
                      : answers[currentQuizStep.questions[index].id]
                        ? 'bg-pink-300'
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {currentQuestionIndex < currentQuizStep.questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="btn btn-primary px-6 py-3 rounded-full font-medium hover:scale-102"
              >
                Next
                <span className="ml-2">→</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`btn px-6 py-3 rounded-full font-medium transition-all ${
                  canProceed
                    ? 'btn-primary hover:scale-102 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Step 4
                <span className="ml-2">🚀</span>
              </button>
            )}
          </div>
        </div>

        {/* Step Overview */}
        <div className="mt-12">
          <div className="gamified-card p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Almost There!
            </h3>
            <div className="grid sm:grid-cols-1 gap-4 text-center">
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <div className="text-2xl mb-2">🎪</div>
                <p className="text-sm font-medium text-gray-700">Final Step: Content Goals</p>
                <p className="text-xs text-gray-500 mt-1">Define your niche and target audience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 