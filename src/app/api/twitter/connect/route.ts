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

    // Return the Twitter OAuth URL for client-side redirect
    const twitterAuthUrl = `/api/auth/signin/twitter?callbackUrl=${encodeURIComponent('/dashboard?twitter_connected=true')}`;
    
    return NextResponse.json({
      success: true,
      authUrl: twitterAuthUrl,
      message: 'Redirect to Twitter authentication'
    });

  } catch (error) {
    console.error('Twitter connection error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Twitter connection' },
      { status: 500 }
    );
  }
} 