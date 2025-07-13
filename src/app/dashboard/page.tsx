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

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Load saved results from localStorage (in production, this would be from a database)
    const loadSavedResults = () => {
      if (session?.user?.id) {
        const userResults = localStorage.getItem(`userResults_${session.user.id}`);
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
    
    if (currentResult && session?.user?.id) {
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
      localStorage.setItem(`userResults_${session.user.id}`, JSON.stringify(updatedResults));
      
      // Clear current result
      localStorage.removeItem('quizResults');
      localStorage.removeItem('resultsType');
    }
  };

  const deleteResult = (id: string) => {
    const updatedResults = savedResults.filter(result => result.id !== id);
    setSavedResults(updatedResults);
    if (session) {
      localStorage.setItem(`userResults_${session.user.id}`, JSON.stringify(updatedResults));
    }
  };

  const viewResult = (result: SavedResult) => {
    // Load the result back into localStorage and navigate to results page
    const resultData = {
      personalityProfile: result.personalityProfile,
      topStrengths: result.topStrengths,
      contentAngles: result.contentAngles,
      actionSteps: result.actionSteps,
      platforms: result.platforms,
    };

    localStorage.setItem('quizResults', JSON.stringify(resultData));
    localStorage.setItem('resultsType', result.type);
    router.push('/results');
  };

  // Check if there's a current result to save
  useEffect(() => {
    const currentResult = localStorage.getItem('quizResults');
    if (currentResult && session && savedResults.length === 0) {
      // Auto-save the first result
      saveCurrentResult();
    }
  }, [session, savedResults]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            {session.user.image && (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session.user.name || 'Creator'}!
              </h1>
              <p className="text-gray-600">
                Track your content creation journey and explore your personalized recommendations.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/quiz/step-1"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">Take New Quiz</h3>
              <p className="text-sm opacity-90">Discover fresh content angles and updated recommendations</p>
            </Link>
            
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Saved Results</h3>
              <p className="text-green-700 text-2xl font-bold">{savedResults.length}</p>
              <p className="text-sm text-green-600">Quiz analyses saved</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">AI Powered</h3>
              <p className="text-blue-700 text-sm">
                {savedResults.filter(r => r.type === 'gemini').length} AI-powered analyses
              </p>
            </div>
          </div>
        </div>

        {/* Saved Results */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Quiz History</h2>
          
          {savedResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
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