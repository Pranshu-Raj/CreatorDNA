// X (Twitter) API Service using OAuth 2.0
export class TwitterService {
  private baseUrl = 'https://api.twitter.com/2';

  async getUserProfile(accessToken: string) {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`X API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async getUserTweets(accessToken: string, userId: string, maxResults: number = 10) {
    try {
      const params = new URLSearchParams({
        'tweet.fields': 'created_at,public_metrics,context_annotations',
        'user.fields': 'username,public_metrics',
        'max_results': maxResults.toString(),
      });

      const response = await fetch(`${this.baseUrl}/users/${userId}/tweets?${params}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`X API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user tweets:', error);
      throw error;
    }
  }

  async analyzeContent(accessToken: string, userId: string) {
    try {
      // Get user profile and tweets
      const [profile, tweets] = await Promise.all([
        this.getUserProfile(accessToken),
        this.getUserTweets(accessToken, userId, 100)
      ]);

      // Analyze the content
      const analysis = this.processAnalysis(profile, tweets);
      return analysis;
    } catch (error) {
      console.error('Error analyzing content:', error);
      throw error;
    }
  }

  private processAnalysis(profile: any, tweets: any) {
    // Process tweets data for analysis
    const tweetData = tweets.data || [];
    
    // Extract topics from context annotations
    const topics = this.extractTopics(tweetData);
    
    // Analyze engagement metrics
    const engagement = this.analyzeEngagement(tweetData);
    
    // Generate posting patterns
    const patterns = this.analyzePostingPatterns(tweetData);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(tweetData, engagement);

    return {
      twitterHandle: profile.data.username,
      analysis: {
        contentStyle: {
          primaryTopics: topics,
          toneAnalysis: this.analyzeTone(tweetData),
          avgEngagement: engagement.avgEngagementRate,
          bestPerformingContent: engagement.bestContent
        },
        postingPatterns: patterns,
        audienceInsights: {
          engagement: engagement.description,
          demographics: this.analyzeDemographics(profile.data),
          interests: topics
        },
        recommendations: recommendations
      },
      lastAnalyzed: new Date().toISOString()
    };
  }

  private extractTopics(tweets: any[]): string[] {
    const topics = new Set<string>();
    
    tweets.forEach(tweet => {
      if (tweet.context_annotations) {
        tweet.context_annotations.forEach((annotation: any) => {
          if (annotation.entity?.name) {
            topics.add(annotation.entity.name);
          }
        });
      }
    });

    return Array.from(topics).slice(0, 5); // Top 5 topics
  }

  private analyzeEngagement(tweets: any[]) {
    if (!tweets.length) {
      return {
        avgEngagementRate: '0%',
        bestContent: 'No tweets to analyze',
        description: 'No engagement data available'
      };
    }

    const engagementRates = tweets.map(tweet => {
      const metrics = tweet.public_metrics;
      if (!metrics) return 0;
      
      const totalEngagement = metrics.like_count + metrics.retweet_count + metrics.reply_count;
      const impressions = metrics.impression_count || 1;
      return (totalEngagement / impressions) * 100;
    });

    const avgRate = engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length;
    const bestTweetIndex = engagementRates.indexOf(Math.max(...engagementRates));
    const bestTweet = tweets[bestTweetIndex];

    return {
      avgEngagementRate: `${avgRate.toFixed(1)}%`,
      bestContent: bestTweet ? bestTweet.text.substring(0, 100) + '...' : 'No content available',
      description: avgRate > 2 ? 'High engagement' : avgRate > 1 ? 'Moderate engagement' : 'Low engagement'
    };
  }

  private analyzePostingPatterns(tweets: any[]) {
    const dates = tweets.map(tweet => new Date(tweet.created_at));
    const hours = dates.map(date => date.getHours());
    
    // Find most common posting hours
    const hourCounts = hours.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const bestHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`);

    return {
      frequency: tweets.length > 30 ? 'Daily' : tweets.length > 10 ? 'Weekly' : 'Occasional',
      bestTimes: bestHours.length ? bestHours : ['9:00', '13:00', '18:00'],
      preferredFormats: ['Original tweets', 'Replies', 'Retweets']
    };
  }

  private analyzeTone(tweets: any[]): string {
    // Simple tone analysis based on content patterns
    const text = tweets.map(tweet => tweet.text).join(' ').toLowerCase();
    
    if (text.includes('excited') || text.includes('amazing') || text.includes('great')) {
      return 'Positive and enthusiastic';
    } else if (text.includes('professional') || text.includes('business')) {
      return 'Professional and formal';
    } else {
      return 'Conversational and authentic';
    }
  }

  private analyzeDemographics(profile: any): string {
    const followerCount = profile.public_metrics?.followers_count || 0;
    
    if (followerCount > 10000) {
      return 'Large, engaged audience';
    } else if (followerCount > 1000) {
      return 'Growing community';
    } else {
      return 'Niche, targeted audience';
    }
  }

  private generateRecommendations(tweets: any[], engagement: any): string[] {
    const recommendations = [];
    
    if (tweets.length < 10) {
      recommendations.push('Consider posting more frequently to increase visibility');
    }
    
    if (engagement.avgEngagementRate.replace('%', '') < '2') {
      recommendations.push('Try using more engaging content formats like questions or polls');
    }
    
    recommendations.push('Engage with your audience by responding to comments');
    recommendations.push('Use relevant hashtags to increase discoverability');
    recommendations.push('Share behind-the-scenes content to build authenticity');
    
    return recommendations;
  }
} 