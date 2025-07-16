'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';

interface TwitterAnalysis {
  twitterHandle: string;
  analysis: {
    contentStyle: {
      primaryTopics: string[];
      toneAnalysis: string;
      avgEngagement: string;
      bestPerformingContent: string;
    };
    postingPatterns: {
      frequency: string;
      bestTimes: string[];
      preferredFormats: string[];
    };
    audienceInsights: {
      engagement: string;
      demographics: string;
      interests: string[];
    };
    recommendations: string[];
  };
  lastAnalyzed: string;
}

export function SocialIntegration() {
  const { data: session, update } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<TwitterAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  const isTwitterConnected = (session?.user as any)?.twitterConnected || demoMode;
  const twitterHandle = (session?.user as any)?.twitterHandle || (demoMode ? 'demo_user' : null);

  const handleConnectTwitter = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      await signIn('twitter', { 
        callbackUrl: '/dashboard?twitter_connected=true' 
      });
      
    } catch (error) {
      console.error('Twitter connection error:', error);
      setError('Failed to connect Twitter account. Please check the Twitter app configuration.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDemoMode = () => {
    setDemoMode(true);
    setError(null);
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      if (demoMode) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockAnalysis = {
          twitterHandle: 'demo_user',
          analysis: {
            contentStyle: {
              primaryTopics: ['Tech Innovation', 'Personal Development', 'Content Creation'],
              toneAnalysis: 'Professional with authentic personal touches',
              avgEngagement: '6.8%',
              bestPerformingContent: 'Educational threads and behind-the-scenes content'
            },
            postingPatterns: {
              frequency: '4-6 posts per week',
              bestTimes: ['9 AM', '2 PM', '7 PM'],
              preferredFormats: ['Threads (45%)', 'Single tweets (35%)', 'Quote tweets (20%)']
            },
            audienceInsights: {
              engagement: 'Higher engagement on educational and personal content',
              demographics: 'Tech-savvy professionals aged 25-40',
              interests: ['AI/ML', 'Creator Economy', 'Productivity Tools', 'Startup Culture']
            },
            recommendations: [
              'Your educational threads perform 3x better than average - create more step-by-step guides',
              'Personal stories about your journey get 2x more engagement - share more authentic moments',
              'Post during your peak times (9 AM and 7 PM) for 40% higher reach',
              'Your audience loves actionable tips - consider a weekly "Tuesday Tips" series',
              'Video content performs 5x better - try incorporating more video tweets'
            ]
          },
          lastAnalyzed: new Date().toISOString()
        };
        
        setAnalysis(mockAnalysis);
        setShowAnalysis(true);
      } else {
        const response = await fetch('/api/twitter/analyze');
        const data = await response.json();
        
        if (data.success) {
          setAnalysis(data.data);
          setShowAnalysis(true);
        } else {
          setError(data.error || 'Failed to analyze Twitter data');
        }
      }
      
    } catch (error) {
      console.error('Twitter analysis error:', error);
      setError('Failed to analyze Twitter data');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (demoMode) {
        setDemoMode(false);
        setAnalysis(null);
        setShowAnalysis(false);
        return;
      }
      
      const response = await fetch('/api/twitter/disconnect', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        await update();
        setAnalysis(null);
        setShowAnalysis(false);
      } else {
        setError(data.error || 'Failed to disconnect Twitter account');
      }
      
    } catch (error) {
      console.error('Twitter disconnect error:', error);
      setError('Failed to disconnect Twitter account');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Twitter Integration</h3>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 w-fit">
                ✨ Advanced Feature
              </span>
              {isTwitterConnected && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                  demoMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {demoMode ? '🧪 Demo Mode' : `Connected as @${twitterHandle}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-600">Twitter Connection Failed</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <div className="mt-3">
                <p className="text-sm text-red-600 mb-2">
                  <strong>Solution:</strong> Your Twitter app is configured as a "Desktop Application". 
                  You need to change it to "Web Application" in the Twitter Developer Portal.
                </p>
                <a 
                  href="https://developer.twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Fix Twitter App Configuration →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isTwitterConnected ? (
        <div className="text-center py-6 sm:py-8">
          <div className="mb-4 sm:mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Unlock Advanced Content Analytics
            </h4>
            <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
              Connect your Twitter account to get detailed insights about your content performance, 
              audience engagement, and personalized recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">Content Analytics</h5>
              <p className="text-sm text-gray-600">Analyze your tweets, engagement patterns, and top-performing content</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">Audience Insights</h5>
              <p className="text-sm text-gray-600">Understand your audience demographics and engagement preferences</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">AI Recommendations</h5>
              <p className="text-sm text-gray-600">Get personalized suggestions to improve your content strategy</p>
            </div>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={handleConnectTwitter}
              disabled={isConnecting}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Connect Twitter Account
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try demo mode</span>
              </div>
            </div>

            <button
              onClick={handleDemoMode}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Try Demo Mode
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            🔒 Your Twitter data is processed securely and never shared with third parties
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                demoMode ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <svg className={`w-6 h-6 ${demoMode ? 'text-yellow-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {demoMode ? 'Demo Mode Active' : 'Twitter Connected'}
                </h4>
                <p className="text-sm text-gray-600">@{twitterHandle}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
              </button>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {demoMode ? 'Exit Demo' : 'Disconnect'}
              </button>
            </div>
          </div>

          {showAnalysis && analysis && (
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Content Analysis Results</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-3">Content Style</h5>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium text-black">Topics:</span> <span className="text-black">{analysis.analysis.contentStyle.primaryTopics.join(', ')}</span></div>
                    <div><span className="font-medium text-black">Tone:</span> <span className="text-black">{analysis.analysis.contentStyle.toneAnalysis}</span></div>
                    <div><span className="font-medium text-black">Engagement:</span> <span className="text-black">{analysis.analysis.contentStyle.avgEngagement}</span></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-3">Posting Patterns</h5>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium text-black">Frequency:</span> <span className="text-black">{analysis.analysis.postingPatterns.frequency}</span></div>
                    <div><span className="font-medium text-black">Best Times:</span> <span className="text-black">{analysis.analysis.postingPatterns.bestTimes.join(', ')}</span></div>
                    <div><span className="font-medium text-black">Formats:</span> <span className="text-black">{analysis.analysis.postingPatterns.preferredFormats.join(', ')}</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg mb-4 sm:mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">🚀 AI Recommendations</h5>
                <ul className="space-y-2 text-sm">
                  {analysis.analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600 font-medium">•</span>
                      <span className="text-black">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-gray-600">
                <span className="text-black">Last analyzed: {new Date(analysis.lastAnalyzed).toLocaleDateString()}</span>
                {demoMode && (
                  <span className="ml-2 text-yellow-600">• Demo data - not from actual Twitter account</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 