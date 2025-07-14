'use client';

import { useState, useEffect } from 'react';
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

export function TwitterConnection() {
  const { data: session, update } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [analysis, setAnalysis] = useState<TwitterAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Type guard for extended session user
  const isTwitterConnected = session?.user && 'twitterConnected' in session.user && session.user.twitterConnected;
  const twitterHandle = session?.user && 'twitterHandle' in session.user ? session.user.twitterHandle : null;

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Use NextAuth's signIn function to redirect to Twitter OAuth
      await signIn('twitter', { 
        callbackUrl: '/dashboard?twitter_connected=true' 
      });
      
    } catch (error) {
      console.error('Twitter connection error:', error);
      setError('Failed to connect Twitter account');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      const response = await fetch('/api/twitter/analyze');
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.data);
        setShowAnalysis(true);
      } else {
        setError(data.error || 'Failed to analyze Twitter data');
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
      setIsDisconnecting(true);
      setError(null);
      
      const response = await fetch('/api/twitter/disconnect', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        // Force session refresh
        await update();
        setAnalysis(null);
        setShowAnalysis(false);
      } else {
        setError(data.error || 'Failed to disconnect Twitter account');
      }
      
    } catch (error) {
      console.error('Twitter disconnect error:', error);
      setError('Failed to disconnect Twitter account');
    } finally {
      setIsDisconnecting(false);
    }
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Twitter Analysis</h3>
            <p className="text-sm text-gray-600">
              {isTwitterConnected 
                ? `Connected as @${twitterHandle || 'Unknown'}` 
                : 'Connect your Twitter to analyze your content style'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isTwitterConnected ? (
            <>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
              </button>
              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isConnecting ? 'Connecting...' : 'Connect Twitter'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {showAnalysis && analysis && (
        <div className="mt-6 space-y-6">
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Analysis Results</h4>
            
            {/* Content Style */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-3">Content Style</h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Primary Topics:</span> {analysis.analysis.contentStyle.primaryTopics.join(', ')}
                  </div>
                  <div>
                    <span className="font-medium">Tone:</span> {analysis.analysis.contentStyle.toneAnalysis}
                  </div>
                  <div>
                    <span className="font-medium">Avg Engagement:</span> {analysis.analysis.contentStyle.avgEngagement}
                  </div>
                  <div>
                    <span className="font-medium">Best Content:</span> {analysis.analysis.contentStyle.bestPerformingContent}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-3">Posting Patterns</h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Frequency:</span> {analysis.analysis.postingPatterns.frequency}
                  </div>
                  <div>
                    <span className="font-medium">Best Times:</span> {analysis.analysis.postingPatterns.bestTimes.join(', ')}
                  </div>
                  <div>
                    <span className="font-medium">Formats:</span> {analysis.analysis.postingPatterns.preferredFormats.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Audience Insights */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h5 className="font-semibold text-gray-900 mb-3">Audience Insights</h5>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Engagement Pattern:</span> {analysis.analysis.audienceInsights.engagement}
                </div>
                <div>
                  <span className="font-medium">Demographics:</span> {analysis.analysis.audienceInsights.demographics}
                </div>
                <div>
                  <span className="font-medium">Interests:</span> {analysis.analysis.audienceInsights.interests.join(', ')}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-900 mb-3">Recommendations</h5>
              <ul className="space-y-2 text-sm">
                {analysis.analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 font-medium">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              Last analyzed: {formatDate(analysis.lastAnalyzed)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 