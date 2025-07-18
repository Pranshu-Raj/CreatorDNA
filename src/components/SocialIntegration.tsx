'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';

interface TwitterAnalysis {
  profile: {
    followers: number;
    following: number;
    tweets: number;
    engagement_rate: number;
  };
  content_style: {
    top_themes: string[];
    tone: string;
    post_frequency: string;
  };
  audience_insights: {
    peak_times: string[];
    top_interests: string[];
    demographics: string;
  };
  recommendations: {
    content_suggestions: string[];
    posting_tips: string[];
    growth_opportunities: string[];
  };
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

  const handleAnalyzeTwitter = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Simulate API call with demo data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const demoAnalysis: TwitterAnalysis = {
        profile: {
          followers: 1250,
          following: 456,
          tweets: 892,
          engagement_rate: 3.4
        },
        content_style: {
          top_themes: ['Tech', 'Productivity', 'Personal Growth'],
          tone: 'Informative & Encouraging',
          post_frequency: '5-7 times per week'
        },
        audience_insights: {
          peak_times: ['9 AM EST', '1 PM EST', '7 PM EST'],
          top_interests: ['Technology', 'Career Development', 'Wellness'],
          demographics: 'Primarily 25-35 year old professionals'
        },
        recommendations: {
          content_suggestions: [
            'Share more behind-the-scenes content',
            'Create tutorial threads',
            'Host Twitter Spaces about your expertise'
          ],
          posting_tips: [
            'Post during peak engagement hours',
            'Use 2-3 relevant hashtags',
            'Ask questions to boost engagement'
          ],
          growth_opportunities: [
            'Collaborate with similar creators',
            'Join Twitter chats in your niche',
            'Create a consistent posting schedule'
          ]
        }
      };
      
      setAnalysis(demoAnalysis);
      setShowAnalysis(true);
      
    } catch (error) {
      console.error('Twitter analysis error:', error);
      setError('Failed to analyze Twitter account. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setDemoMode(false);
      setAnalysis(null);
      setShowAnalysis(false);
      setError(null);
      
      // In a real app, you would call an API to disconnect
      // await fetch('/api/twitter/disconnect', { method: 'POST' });
      
    } catch (error) {
      console.error('Error disconnecting Twitter:', error);
      setError('Failed to disconnect Twitter account.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Twitter Connection Card */}
      <div className="gamified-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🐦</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Twitter Integration</h3>
            <p className="text-gray-600 text-sm">
              Connect your Twitter account to unlock advanced analytics and personalized content insights
            </p>
          </div>
        </div>

        {/* Connection Status */}
        {isTwitterConnected ? (
          <div className="bg-white p-4 rounded-2xl border border-green-200 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800">
                Connected as @{twitterHandle}
              </span>
              {demoMode && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Demo Mode
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="font-medium text-gray-600">Not Connected</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!isTwitterConnected ? (
            <>
              <button
                onClick={handleConnectTwitter}
                disabled={isConnecting}
                className={`flex-1 btn btn-primary px-6 py-3 rounded-full font-medium transition-all ${
                  isConnecting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102'
                }`}
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🔗</span>
                    Connect Twitter
                  </>
                )}
              </button>
              <button
                onClick={handleDemoMode}
                className="flex-1 btn btn-secondary px-6 py-3 rounded-full font-medium hover:scale-102"
              >
                <span className="mr-2">🎭</span>
                Try Demo Mode
              </button>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleAnalyzeTwitter}
                disabled={isAnalyzing}
                className={`flex-1 btn btn-primary px-6 py-3 rounded-full font-medium transition-all ${
                  isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📊</span>
                    Analyze Account
                  </>
                )}
              </button>
              <button
                onClick={handleDisconnect}
                className="btn btn-tertiary px-6 py-3 rounded-full font-medium hover:scale-102"
              >
                <span className="mr-2">🔓</span>
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="gamified-card p-4 bg-red-50 border border-red-200">
          <div className="flex items-center space-x-3">
            <span className="text-red-600 text-xl">⚠️</span>
            <div>
              <p className="text-red-800 font-medium mb-1">Connection Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Results */}
      {showAnalysis && analysis && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="gamified-card p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📈</span>
              Account Overview
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <div className="text-2xl font-bold text-emerald-600">{analysis.profile.followers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <div className="text-2xl font-bold text-teal-600">{analysis.profile.following.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{analysis.profile.tweets.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Tweets</div>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center shadow-sm">
                <div className="text-2xl font-bold text-purple-600">{analysis.profile.engagement_rate}%</div>
                <div className="text-sm text-gray-600">Engagement</div>
              </div>
            </div>
          </div>

          {/* Content Analysis */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Content Style */}
            <div className="gamified-card p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🎨</span>
                Content Style
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Top Themes</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.content_style.top_themes.map((theme, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-1">Tone</h5>
                  <p className="text-gray-600 text-sm">{analysis.content_style.tone}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-1">Frequency</h5>
                  <p className="text-gray-600 text-sm">{analysis.content_style.post_frequency}</p>
                </div>
              </div>
            </div>

            {/* Audience Insights */}
            <div className="gamified-card p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👥</span>
                Audience Insights
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Peak Times</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.audience_insights.peak_times.map((time, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Top Interests</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.audience_insights.top_interests.map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-1">Demographics</h5>
                  <p className="text-gray-600 text-sm">{analysis.audience_insights.demographics}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="gamified-card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">💡</span>
              Personalized Recommendations
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <h5 className="font-medium text-green-800 mb-3 flex items-center">
                  <span className="mr-2">📝</span>
                  Content Ideas
                </h5>
                <ul className="space-y-2">
                  {analysis.recommendations.content_suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <h5 className="font-medium text-emerald-800 mb-3 flex items-center">
                  <span className="mr-2">📌</span>
                  Posting Tips
                </h5>
                <ul className="space-y-2">
                  {analysis.recommendations.posting_tips.map((tip, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-emerald-500 mr-2 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <h5 className="font-medium text-teal-800 mb-3 flex items-center">
                  <span className="mr-2">🚀</span>
                  Growth Opportunities
                </h5>
                <ul className="space-y-2">
                  {analysis.recommendations.growth_opportunities.map((opportunity, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-teal-500 mr-2 mt-1">•</span>
                      <span>{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 