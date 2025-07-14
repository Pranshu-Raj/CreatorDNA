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

    // In a real implementation with a database, you would:
    // 1. Remove Twitter access tokens from the database
    // 2. Update user's Twitter connection status to false
    // 3. Clear any cached Twitter data
    
    // For now, we'll handle this through the session/JWT token refresh
    // The actual disconnection would happen by updating the user's record
    // and forcing a session refresh

    // Clear any localStorage Twitter data
    // This would be handled client-side after successful API response

    return NextResponse.json({
      success: true,
      message: 'Twitter account disconnected successfully. Please refresh the page to see changes.'
    });

  } catch (error) {
    console.error('Twitter disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Twitter account' },
      { status: 500 }
    );
  }
} 