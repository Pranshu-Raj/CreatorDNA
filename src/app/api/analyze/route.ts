import { NextRequest, NextResponse } from 'next/server';
import { analyzeCreatorPersonality } from '@/lib/geminiService';
import { QuizAnswer } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { answers }: { answers: QuizAnswer[] } = body;

    // Validate the request
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid quiz answers provided' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Analyze with Gemini
    const analysis = await analyzeCreatorPersonality(answers);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze quiz results' },
      { status: 500 }
    );
  }
} 