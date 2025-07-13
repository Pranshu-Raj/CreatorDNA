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

  const handleSaveResults = () => {
    if (!session || !results) return;

    const savedResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: resultsType,
      personalityProfile: results.personalityProfile,
      topStrengths: results.topStrengths,
      contentAngles: (results as GeminiAnalysisResult).contentAngles || (results as QuizResult).angles,
      actionSteps: (results as GeminiAnalysisResult).actionSteps,
      platforms: (results as GeminiAnalysisResult).platforms,
    };

    const existingResults = localStorage.getItem(`userResults_${session.user.id}`);
    const userResults = existingResults ? JSON.parse(existingResults) : [];
    const updatedResults = [savedResult, ...userResults].slice(0, 10);
    
    localStorage.setItem(`userResults_${session.user.id}`, JSON.stringify(updatedResults));
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your personality...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No results found. Please take the quiz first.</p>
          <Link href="/" className="text-purple-600 underline mt-2 inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />

      {/* Results Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Unique <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Content Angles</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Based on your personality and background, here are personalized content angles that will help you stand out.
            </p>
          </div>

          {/* Personality Profile */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Creator Profile</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-purple-600 mb-2">Personality Type</h4>
                <p className="text-gray-700">{results.personalityProfile}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-2">Your Top Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {results.topStrengths.map((strength: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Personalized Content Angles</h3>
            <div className="grid gap-6">
              {(resultsType === 'gemini' 
                ? (results as GeminiAnalysisResult).contentAngles 
                : (results as QuizResult).angles
              ).map((angle: { id?: string; title: string; description: string; examples: string[] }, index: number) => (
                <div key={angle.id || index} className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          #{index + 1}
                        </span>
                        <h4 className="text-xl font-bold text-gray-900">{angle.title}</h4>
                      </div>
                      <p className="text-gray-600 text-lg">{angle.description}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-3">Content Ideas to Get Started:</h5>
                    <ul className="space-y-2">
                      {angle.examples.map((example: string, exampleIndex: number) => (
                        <li key={exampleIndex} className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          <span className="text-gray-700">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Steps (Gemini only) */}
          {resultsType === 'gemini' && (results as GeminiAnalysisResult).actionSteps && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Content Creation Roadmap</h3>
              <div className="grid gap-6">
                {(results as GeminiAnalysisResult).actionSteps.map((step: { title: string; description: string; tasks: string[] }, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-700 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.tasks.map((task: string, taskIndex: number) => (
                        <li key={taskIndex} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-gray-700">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Recommendations (Gemini only) */}
          {resultsType === 'gemini' && (results as GeminiAnalysisResult).platforms && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Platforms for You</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {(results as GeminiAnalysisResult).platforms.map((platform: { platform: string; why: string; tips: string[] }, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="text-xl font-bold text-purple-600 mb-2">{platform.platform}</h4>
                    <p className="text-gray-700 mb-4">{platform.why}</p>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Tips to Get Started:</h5>
                      <ul className="space-y-1">
                        {platform.tips.map((tip: string, tipIndex: number) => (
                          <li key={tipIndex} className="flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span className="text-gray-600 text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Actions */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Creating?</h3>
            <p className="text-lg mb-6">
              {resultsType === 'gemini' ? (
                <>Your AI-powered analysis is complete! Use these personalized recommendations to create content that&rsquo;s authentically you. Remember, your unique background is your competitive advantage!</>
              ) : (
                <>Use these personalized angles to create content that&rsquo;s authentically you. Remember, your unique background is your competitive advantage!</>
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session && (
                <button
                  onClick={handleSaveResults}
                  disabled={saved}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {saved ? '✓ Saved!' : 'Save Results'}
                </button>
              )}
              <button
                onClick={handleTakeAgain}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Take Quiz Again
              </button>
              {session ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  View Dashboard
                </Link>
              ) : (
                <Link
                  href="/"
                  className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Back to Home
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 