'use client';

import { useSession } from 'next-auth/react';

// Extended session type to include user ID
interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    twitterConnected?: boolean;
    twitterHandle?: string | null;
  };
}
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { SocialIntegration } from '@/components/SocialIntegration';
import { AccountSettings } from '@/components/AccountSettings';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'social' | 'settings'>('overview');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Load saved results from localStorage
    const loadSavedResults = () => {
      try {
        const saved = localStorage.getItem('quiz-results');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSavedResults(Array.isArray(parsed) ? parsed : [parsed]);
        }
      } catch (error) {
        console.error('Error loading saved results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedResults();
  }, [session, status, router]);

  const handleDeleteResult = (id: string) => {
    const updatedResults = savedResults.filter(result => result.id !== id);
    setSavedResults(updatedResults);
    localStorage.setItem('quiz-results', JSON.stringify(updatedResults));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {session.user?.name?.split(' ')[0] || 'Creator'}!
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Discover your creative potential and unlock advanced features
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 mb-6 sm:mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'social'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="hidden sm:inline">Social Integration</span>
            <span className="sm:hidden">Social</span>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
              ✨ Premium
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Quick Action */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 sm:p-6 text-white">
                <h2 className="text-lg sm:text-xl font-bold mb-2">Ready to discover your creative DNA?</h2>
                <p className="text-purple-100 mb-4 text-sm sm:text-base">
                  Take our comprehensive personality quiz to get personalized insights and content recommendations.
                </p>
                <Link
                  href="/quiz/step-1"
                  className="inline-flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Start Quiz
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Twitter Integration Promotion */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Unlock Twitter Analytics</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Get deep insights into your content performance and audience engagement
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('social')}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm sm:text-base flex-shrink-0"
                  >
                    Connect Twitter
                  </button>
                </div>
              </div>

              {/* Current Result Alert */}
              {savedResults.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">
                        <strong>Great!</strong> You have {savedResults.length} saved result{savedResults.length > 1 ? 's' : ''} from your personality quiz.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Results */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading your results...</p>
                </div>
              ) : savedResults.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No quiz results yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by taking your first personality quiz.</p>
                  <div className="mt-6">
                    <Link
                      href="/quiz/step-1"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Take Quiz
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Saved Results</h2>
                  <div className="grid gap-4 sm:gap-6">
                    {savedResults.map((result) => (
                      <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                Quiz Result
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                result.type === 'gemini' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {result.type === 'gemini' ? 'AI-Powered' : 'Local Analysis'}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-4">
                              Completed on {formatDate(result.date)}
                            </p>
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Personality Profile:</h4>
                              <p className="text-gray-700 text-xs sm:text-sm">{result.personalityProfile}</p>
                            </div>
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Top Strengths:</h4>
                              <div className="flex flex-wrap gap-2">
                                {result.topStrengths.map((strength, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 sm:ml-4 flex-shrink-0">
                            <Link
                              href={`/results?id=${result.id}`}
                              className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 text-center"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => handleDeleteResult(result.id)}
                              className="inline-flex items-center justify-center px-3 py-1 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Social Integration</h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Connect your social accounts to unlock advanced analytics and personalized insights
                </p>
              </div>
              <div className="w-full">
                <SocialIntegration />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Account Settings</h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Manage your account and connected services
                </p>
              </div>
              <div className="w-full">
                <AccountSettings />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 