'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/QuizContext';
import { QuizQuestion } from '@/components/QuizQuestion';
import { quizSteps } from '@/lib/quizData';
import { Navbar } from '@/components/Navbar';
import { calculateContentAngles } from '@/lib/matchingAlgorithm';
import { analyzeCreatorPersonality } from '@/lib/geminiService';
import { useSession } from 'next-auth/react';

export default function QuizStep4Page() {
  const router = useRouter();
  const { state, addAnswer, nextStep, prevStep } = useQuiz();
  const { data: session } = useSession();
  
  const currentQuizStep = quizSteps.find(step => step.step === 4);
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [canProceed, setCanProceed] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState<'local' | 'gemini'>('local');

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

  const handleAnalyze = async () => {
    if (!canProceed) return;
    
    setIsAnalyzing(true);
    
    try {
      let results;
      
      if (analysisType === 'gemini') {
        results = await analyzeCreatorPersonality(state.answers);
      } else {
        results = calculateContentAngles(state.answers);
      }
      
      // Save results to localStorage
      const resultsWithId = {
        ...results,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: analysisType,
      };
      
      localStorage.setItem('quizResults', JSON.stringify(resultsWithId));
      localStorage.setItem('resultsType', analysisType);
      
      // Save to quiz results history
      const existingResults = JSON.parse(localStorage.getItem('quiz-results') || '[]');
      const updatedResults = Array.isArray(existingResults) ? existingResults : [existingResults];
      updatedResults.push(resultsWithId);
      localStorage.setItem('quiz-results', JSON.stringify(updatedResults));
      
      router.push('/results');
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback to local analysis
      const results = calculateContentAngles(state.answers);
      const resultsWithId = {
        ...results,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: 'local',
      };
      
      localStorage.setItem('quizResults', JSON.stringify(resultsWithId));
      localStorage.setItem('resultsType', 'local');
      
      router.push('/results');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      prevStep();
      router.push('/quiz/step-3');
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
          <div className="gamified-card p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-4xl cute-illustration">🎪</span>
              <h1 className="text-2xl sm:text-3xl font-bold">Step 4: Content Goals</h1>
            </div>
            <p className="text-orange-100 text-sm sm:text-base">
              Define your niche and target audience for maximum impact
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
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
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
                      ? 'bg-orange-500 scale-125'
                      : answers[currentQuizStep.questions[index].id]
                        ? 'bg-red-300'
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
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Analysis Type Selection */}
                <div className="flex flex-col items-center">
                  <div className="flex rounded-full bg-gray-100 p-1 mb-2">
                    <button
                      onClick={() => setAnalysisType('local')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        analysisType === 'local' 
                          ? 'bg-emerald-500 text-white shadow-lg' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <span className="mr-1">🧠</span>
                      Quick Match
                    </button>
                    <button
                      onClick={() => setAnalysisType('gemini')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        analysisType === 'gemini' 
                          ? 'bg-emerald-500 text-white shadow-lg' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <span className="mr-1">🤖</span>
                      AI Analysis
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!canProceed || isAnalyzing}
                  className={`btn px-8 py-3 rounded-full font-medium transition-all ${
                    canProceed && !isAnalyzing
                                             ? 'btn-primary hover:scale-102 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Get My Results
                      <span className="ml-2">✨</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Final Step Message */}
        <div className="mt-12">
          <div className="gamified-card p-6 bg-gradient-to-br from-orange-50 to-red-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎉</span>
              You're Almost Done!
            </h3>
            <div className="text-center">
              <div className="p-6 bg-white rounded-2xl shadow-sm">
                <div className="text-4xl mb-4 cute-illustration">🌟</div>
                <p className="text-gray-700 font-medium mb-2">Complete this final step to discover:</p>
                <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>📊 Your unique content angles</div>
                  <div>🎯 Personalized recommendations</div>
                  <div>💡 Actionable insights</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 