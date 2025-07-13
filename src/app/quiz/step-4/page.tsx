'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuiz } from '@/lib/QuizContext';
import { QuizQuestion } from '@/components/QuizQuestion';
import { quizSteps } from '@/lib/quizData';
import { calculateContentAngles } from '@/lib/matchingAlgorithm';
import { Navbar } from '@/components/Navbar';
import { LoginModal } from '@/components/LoginModal';

export default function QuizStep4Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const { state, addAnswer, prevStep } = useQuiz();
  
  const currentQuizStep = quizSteps.find(step => step.step === 4);
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [canProceed, setCanProceed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  // Check if we should auto-trigger analysis after login
  useEffect(() => {
    if (session && localStorage.getItem('triggerAnalysisAfterLogin') === 'true') {
      localStorage.removeItem('triggerAnalysisAfterLogin');
      // Check if all questions are answered before proceeding
      const allAnswered = currentQuizStep?.questions.every(question => {
        const answer = answers[question.id];
        if (answer === undefined) return false;
        if (question.type === 'text') return true;
        if (question.type === 'multi-select') {
          return Array.isArray(answer) && answer.length > 0;
        }
        return answer !== '' && answer !== undefined;
      }) || false;
      
      if (allAnswered) {
        // Small delay to ensure all state is properly set
        setTimeout(() => {
          handleNext();
        }, 100);
      }
    }
  }, [session, answers, currentQuizStep]);

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

  const handleNext = async () => {
    // Check if user is authenticated
    if (!session) {
      setShowLoginModal(true);
      return;
    }

    try {
      // Show loading state
      setIsAnalyzing(true);
      
      // Send quiz answers to Gemini API for analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: state.answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze quiz results');
      }

      const geminiResults = await response.json();
      
      // Store AI-generated results
      localStorage.setItem('quizResults', JSON.stringify(geminiResults));
      localStorage.setItem('resultsType', 'gemini');
      
      router.push('/results');
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      
      // Fallback to local algorithm if Gemini fails
      const fallbackResults = calculateContentAngles(state.answers);
      localStorage.setItem('quizResults', JSON.stringify(fallbackResults));
      localStorage.setItem('resultsType', 'local');
      
      router.push('/results');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Analysis will be triggered automatically after login via useEffect
  };

  const handlePrev = () => {
    prevStep();
    router.push('/quiz/step-3');
  };

  const progress = (4 / 4) * 100;

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
          <p className="text-sm text-gray-600 mt-2">Step 4 of 4</p>
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
                disabled={!canProceed || isAnalyzing}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  canProceed && !isAnalyzing
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing with AI...
                  </div>
                ) : (
                  session ? 'Get My AI Analysis' : 'Sign in & Get AI Analysis'
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
} 