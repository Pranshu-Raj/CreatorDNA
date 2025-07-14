'use client';

import { useSession } from 'next-auth/react';

// Extended session type to include user ID
interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { TwitterConnection } from '@/components/TwitterConnection';

interface SavedResult {
  id: string;
  date: string;
  type: 'gemini' | 'local';
  personalityProfile: string;
  topStrengths: string[];
  contentAngles?: Array<{
    title: string;
    description: string;
    why: string;
    examples: string[];
  }>;
  actionSteps?: Array<{
    timeframe: string;
    title: string;
    description: string;
    tasks: string[];
  }>;
  platforms?: Array<{
    platform: string;
    why: string;
    tips: string[];
  }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Type guard for user ID
  const getUserId = () => {
    return session?.user && 'id' in session.user ? (session.user as any).id : null;
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Load saved results from localStorage (in production, this would be from a database)
    const loadSavedResults = () => {
      const userId = getUserId();
      if (userId) {
        const userResults = localStorage.getItem(`userResults_${userId}`);
        if (userResults) {
          setSavedResults(JSON.parse(userResults));
        }
      }
      setIsLoading(false);
    };

    loadSavedResults();
  }, [session, status, router]);

  const saveCurrentResult = () => {
    const currentResult = localStorage.getItem('quizResults');
    const resultType = localStorage.getItem('resultsType') as 'gemini' | 'local';
    const userId = getUserId();
    
    if (currentResult && userId) {
      const result = JSON.parse(currentResult);
      const newSavedResult: SavedResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: resultType || 'local',
        personalityProfile: result.personalityProfile,
        topStrengths: result.topStrengths,
        contentAngles: result.contentAngles || result.angles,
        actionSteps: result.actionSteps,
        platforms: result.platforms,
      };

      const updatedResults = [newSavedResult, ...savedResults].slice(0, 10); // Keep last 10 results
      setSavedResults(updatedResults);
      localStorage.setItem(`userResults_${userId}`, JSON.stringify(updatedResults));
      
      // Clear current result
      localStorage.removeItem('quizResults');
      localStorage.removeItem('resultsType');
    }
  };

  const deleteResult = (id: string) => {
    const updatedResults = savedResults.filter(result => result.id !== id);
    setSavedResults(updatedResults);
    const userId = getUserId();
    if (userId) {
      localStorage.setItem(`userResults_${userId}`, JSON.stringify(updatedResults));
    }
  };

  const viewResult = (result: SavedResult) => {
    localStorage.setItem('quizResults', JSON.stringify(result));
    localStorage.setItem('resultsType', result.type);
    router.push('/results');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const hasCurrentResult = localStorage.getItem('quizResults');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Creator'}!
          </h1>
          <p className="text-gray-600">
            Track your CreatorDNA analysis and discover new content angles.
          </p>
        </div>

        {/* Twitter Connection Section */}
        <div className="mb-8">
          <TwitterConnection />
        </div>

        {/* Current Result Alert */}
        {hasCurrentResult && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  You have unsaved quiz results!
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Save your latest quiz results to your dashboard for future reference.
                </p>
                <div className="mt-3 flex space-x-3">
                  <button
                    onClick={saveCurrentResult}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md font-medium transition-colors"
                  >
                    Save Results
                  </button>
                  <Link
                    href="/results"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Results
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/quiz/step-1"
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  Take New Quiz
                </h3>
                <p className="text-gray-600">
                  Discover fresh content angles with our updated quiz
                </p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => {
              if (hasCurrentResult) {
                router.push('/results');
              } else {
                router.push('/quiz/step-1');
              }
            }}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {hasCurrentResult ? 'View Latest Results' : 'View Analysis'}
                </h3>
                <p className="text-gray-600">
                  {hasCurrentResult ? 'Check your most recent quiz results' : 'See your content creation insights'}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Saved Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Quiz History</h2>
          
          {savedResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No quiz results yet</h3>
              <p className="text-gray-600 mb-6">Take your first quiz to get personalized content creation recommendations.</p>
              <Link
                href="/quiz/step-1"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Take Your First Quiz
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {savedResults.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Quiz Results
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.type === 'gemini' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {result.type === 'gemini' ? 'AI Powered' : 'Standard'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {new Date(result.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-gray-700 mb-3">{result.personalityProfile}</p>
                      <div className="flex flex-wrap gap-2">
                        {result.topStrengths.slice(0, 3).map((strength: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => viewResult(result)}
                        className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => deleteResult(result.id)}
                        className="px-3 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 