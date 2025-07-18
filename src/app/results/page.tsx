'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QuizResult } from '@/types';
import { useQuiz } from '@/lib/QuizContext';
import { GeminiAnalysisResult } from '@/lib/geminiService';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';

export default function ResultsPage() {
  const router = useRouter();
  const { resetQuiz } = useQuiz();
  const { data: session } = useSession();
  const [results, setResults] = useState<QuizResult | GeminiAnalysisResult | null>(null);
  const [resultsType, setResultsType] = useState<'local' | 'gemini'>('local');
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Get results from localStorage
    const storedResults = localStorage.getItem('quizResults');
    const storedType = localStorage.getItem('resultsType') as 'local' | 'gemini' || 'local';
    
    if (storedResults) {
      setResults(JSON.parse(storedResults));
      setResultsType(storedType);
    } else {
      // If no results, redirect to quiz
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  const handleTakeAgain = () => {
    resetQuiz();
    localStorage.removeItem('quizResults');
    router.push('/');
  };

  const handleSave = () => {
    if (!results || !session) return;
    
    const savedResult = {
      ...results,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: resultsType,
    };
    
    // Save to persistent storage
    const existingResults = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    const updatedResults = Array.isArray(existingResults) ? existingResults : [existingResults];
    updatedResults.push(savedResult);
    localStorage.setItem('quiz-results', JSON.stringify(updatedResults));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen nature-bg">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="gamified-card p-8 text-center">
            <div className="text-4xl mb-4 cute-illustration">🌱</div>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen nature-bg">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="gamified-card p-8 text-center">
            <div className="text-4xl mb-4 cute-illustration">🤔</div>
            <p className="text-gray-600 mb-4">No results found. Let's take the quiz!</p>
            <Link href="/" className="btn btn-primary px-6 py-3 rounded-full font-medium">
              Start Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen nature-bg">
      <Navbar />

      {/* Results Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="gamified-card p-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              <div className="text-6xl mb-4 cute-illustration">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Unique <span className="text-emerald-200">Content DNA</span> Revealed!
              </h2>
              <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
                Based on your personality and background, here are personalized content angles that will help you stand out.
              </p>
            </div>
          </div>

          {/* Analysis Type Badge */}
          <div className="flex justify-center mb-8">
            <div className="gamified-card p-4 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{resultsType === 'gemini' ? '🤖' : '🧠'}</span>
                <span className="font-medium text-gray-700">
                  {resultsType === 'gemini' ? 'AI-Powered Analysis' : 'Quick Match Analysis'}
                </span>
              </div>
            </div>
          </div>

          {/* Personality Profile */}
          <div className="gamified-card p-8 mb-8 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl cute-illustration">🎭</span>
              <h3 className="text-2xl font-bold text-gray-900">Your Creator Profile</h3>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h4 className="text-lg font-semibold text-purple-600 mb-3 flex items-center">
                  <span className="mr-2">🌟</span>
                  Personality Type
                </h4>
                <p className="text-gray-700 leading-relaxed">{results.personalityProfile}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h4 className="text-lg font-semibold text-pink-600 mb-3 flex items-center">
                  <span className="mr-2">💪</span>
                  Your Top Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {results.topStrengths.map((strength: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Angles */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <span className="mr-2">🎯</span>
                Your Perfect Content Angles
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These content angles are uniquely matched to your personality and background
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {(resultsType === 'gemini' ? (results as GeminiAnalysisResult).contentAngles : (results as QuizResult).angles).map((angle: any, index: number) => (
                <div key={index} className="gamified-card p-6 hover:scale-102 transition-all">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{angle.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{angle.description}</p>
                      {angle.why && (
                        <p className="text-emerald-700 text-sm font-medium mb-3 bg-emerald-50 p-2 rounded-lg">
                          <span className="mr-1">💡</span>
                          {angle.why}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                      <span className="mr-2">🎨</span>
                      Content Ideas:
                    </h5>
                    <ul className="space-y-1">
                      {angle.examples.map((example: string, exampleIndex: number) => (
                        <li key={exampleIndex} className="text-gray-700 text-sm flex items-start">
                          <span className="text-emerald-500 mr-2 mt-1">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Additional Sections */}
          {resultsType === 'gemini' && (
            <>
              {/* Action Steps */}
              <div className="gamified-card p-8 mb-8 bg-gradient-to-br from-teal-50 to-cyan-50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">📋</span>
                  Your Action Plan
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {(results as GeminiAnalysisResult).actionSteps.map((step, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
                      <h4 className="text-lg font-semibold text-teal-600 mb-3">{step.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="text-gray-700 text-sm flex items-start">
                            <span className="text-teal-500 mr-2 mt-1">✓</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Recommendations */}
              <div className="gamified-card p-8 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">📱</span>
                  Perfect Platforms for You
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {(results as GeminiAnalysisResult).platforms.map((platform, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
                      <h4 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
                        <span className="mr-2">🎯</span>
                        {platform.platform}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">{platform.why}</p>
                      <div className="space-y-2">
                        {platform.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="text-gray-700 text-sm flex items-start bg-blue-50 p-2 rounded-lg">
                            <span className="text-blue-500 mr-2 mt-1">💡</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleTakeAgain}
                             className="btn btn-secondary px-8 py-3 rounded-full font-medium hover:scale-102"
            >
              <span className="mr-2">🔄</span>
              Take Quiz Again
            </button>
            
            {session && (
              <button
                onClick={handleSave}
                disabled={saved}
                className={`btn px-8 py-3 rounded-full font-medium transition-all ${
                  saved 
                    ? 'bg-green-500 text-white' 
                                         : 'btn-primary hover:scale-102'
                }`}
              >
                {saved ? (
                  <>
                    <span className="mr-2">✅</span>
                    Saved!
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    Save Results
                  </>
                )}
              </button>
            )}
            
            <Link
              href="/dashboard"
                             className="btn btn-primary px-8 py-3 rounded-full font-medium hover:scale-102"
            >
              <span className="mr-2">📊</span>
              Go to Dashboard
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="text-center mt-12 pb-8">
            <div className="flex justify-center space-x-8">
              <span className="text-4xl cute-illustration">🌟</span>
              <span className="text-4xl cute-illustration">🚀</span>
              <span className="text-4xl cute-illustration">🎨</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 