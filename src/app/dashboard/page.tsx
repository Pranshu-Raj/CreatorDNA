'use client';

import { useSession } from 'next-auth/react';
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
      <div className="min-h-screen nature-bg">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="gamified-card p-8 text-center">
            <div className="text-4xl mb-4 cute-illustration">🌱</div>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your creative space...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen nature-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="gamified-card p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            <div className="flex items-center space-x-4">
              <div className="text-5xl cute-illustration">👋</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Welcome back, {session.user?.name?.split(' ')[0] || 'Creator'}!
                </h1>
                <p className="text-emerald-100 mt-2 text-sm sm:text-base">
                  Discover your creative potential and unlock advanced features
                  <span className="cute-illustration ml-2">✨</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="gamified-card p-2 bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-medium transition-all text-sm sm:text-base ${
                  activeTab === 'overview'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-emerald-600'
                }`}
              >
                <span className="mr-2">📊</span>
                Overview
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-medium transition-all text-sm sm:text-base ${
                  activeTab === 'social'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-emerald-600'
                }`}
              >
                <span className="mr-2">🔗</span>
                <span className="hidden sm:inline">Social Integration</span>
                <span className="sm:hidden">Social</span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
                  ✨ Premium
                </span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-medium transition-all text-sm sm:text-base ${
                  activeTab === 'settings'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-emerald-600'
                }`}
              >
                <span className="mr-2">⚙️</span>
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Quick Action */}
              <div className="gamified-card p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl cute-illustration">🎯</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Ready to discover your creative DNA?</h2>
                    <p className="text-emerald-100 text-sm sm:text-base">
                      Take our comprehensive personality quiz to get personalized insights and content recommendations.
                    </p>
                  </div>
                </div>
                <Link
                  href="/quiz/step-1"
                  className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Start Quiz
                  <span className="ml-2">🚀</span>
                </Link>
              </div>

              {/* Twitter Integration Promotion */}
              <div className="gamified-card p-6 bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl cute-illustration">🐦</span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">Connect Your Social Accounts</h3>
                    <p className="text-purple-100 text-sm sm:text-base">
                      Unlock advanced analytics and get personalized content recommendations based on your social media activity.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                    <span className="mr-1">📊</span>
                    Analytics
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                    <span className="mr-1">🎨</span>
                    Content Ideas
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                    <span className="mr-1">📈</span>
                    Growth Tips
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('social')}
                  className="mt-4 inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Connect Social Account
                  <span className="ml-2">🔗</span>
                </button>
              </div>

              {/* Saved Results */}
              <div className="gamified-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl cute-illustration">📋</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Your Quiz Results</h3>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading your results...</p>
                  </div>
                ) : savedResults.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4 cute-illustration">🌱</div>
                    <p className="text-gray-600 mb-4">No quiz results yet. Take the quiz to get personalized insights!</p>
                    <Link
                      href="/quiz/step-1"
                      className="btn btn-primary px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl"
                    >
                      Take Quiz Now
                      <span className="ml-2">🎯</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedResults.map((result) => (
                      <div key={result.id} className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-xl">{result.type === 'gemini' ? '🤖' : '🧠'}</span>
                              <span className="text-sm text-gray-600">{formatDate(result.date)}</span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
                                {result.type === 'gemini' ? 'AI Analysis' : 'Quick Match'}
                              </span>
                            </div>
                            <p className="text-gray-800 font-medium mb-1">{result.personalityProfile}</p>
                            <div className="flex flex-wrap gap-1">
                              {result.topStrengths.map((strength, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-medium"
                                >
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            <Link
                              href="/results"
                              className="px-4 py-2 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition-colors text-sm"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => handleDeleteResult(result.id)}
                              className="px-4 py-2 bg-red-100 text-red-600 rounded-full font-medium hover:bg-red-200 transition-colors text-sm"
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
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="gamified-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl cute-illustration">🌐</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Social Integration</h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Connect your social accounts to unlock advanced analytics and personalized insights
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <SocialIntegration />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="gamified-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl cute-illustration">⚙️</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Account Settings</h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Manage your account and connected services
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <AccountSettings />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 