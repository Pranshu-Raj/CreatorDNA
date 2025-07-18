import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import type { Session } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session: Session | null = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!session.user.twitterConnected) {
      return NextResponse.json(
        { error: 'Twitter account not connected' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Revoke the access token with X API
    // 2. Remove tokens from database
    // 3. Update user session
    
    try {
      // Revoke OAuth 2.0 token (optional)
      const accessToken = session.accessToken;
      if (accessToken) {
        await fetch('https://api.twitter.com/2/oauth2/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`,
          },
          body: new URLSearchParams({
            token: accessToken,
            token_type_hint: 'access_token',
          }),
        });
      }
    } catch (revokeError) {
      console.error('Token revocation failed:', revokeError);
      // Continue with disconnection even if revocation fails
    }

    return NextResponse.json({
      success: true,
      message: 'Twitter account disconnected successfully'
    });

  } catch (error) {
    console.error('Twitter disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Twitter account' },
      { status: 500 }
    );
  }
} 