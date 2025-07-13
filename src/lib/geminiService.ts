import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizAnswer } from '@/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface GeminiAnalysisResult {
  personalityProfile: string;
  topStrengths: string[];
  contentAngles: {
    title: string;
    description: string;
    examples: string[];
  }[];
  actionSteps: {
    title: string;
    description: string;
    tasks: string[];
  }[];
  platforms: {
    platform: string;
    why: string;
    tips: string[];
  }[];
}

export async function analyzeCreatorPersonality(answers: QuizAnswer[]): Promise<GeminiAnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Convert answers to a readable format for the prompt
  const formattedAnswers = answers.map(answer => {
    const questionId = answer.questionId;
    const answerValue = Array.isArray(answer.answer) 
      ? answer.answer.join(', ') 
      : answer.answer;
    
    return `${questionId}: ${answerValue}`;
  }).join('\n');

  const prompt = `
You are an expert content creation strategist and personality analyst. Based on the following quiz responses from someone wanting to become a content creator, provide a comprehensive analysis and actionable guidance.

QUIZ RESPONSES:
${formattedAnswers}

Please provide a detailed analysis in the following JSON format:

{
  "personalityProfile": "A 2-3 sentence description of their creator personality and unique approach",
  "topStrengths": ["3-4 key strengths as a content creator"],
  "contentAngles": [
    {
      "title": "Catchy angle name",
      "description": "What makes this angle unique and compelling",
      "examples": ["3-4 specific content ideas they could create"]
    }
    // Provide 4-5 unique content angles
  ],
  "actionSteps": [
    {
      "title": "Step title (Week 1-2, Month 1, etc.)",
      "description": "What to focus on in this phase",
      "tasks": ["3-4 specific actionable tasks"]
    }
    // Provide 4-5 progressive steps
  ],
  "platforms": [
    {
      "platform": "Platform name",
      "why": "Why this platform suits them",
      "tips": ["3 platform-specific tips"]
    }
    // Recommend 2-3 best platforms
  ]
}

Guidelines:
- Make recommendations highly specific to their background, skills, and personality
- Content angles should be unique and not generic
- Action steps should be practical and achievable
- Platform recommendations should match their comfort level and content style
- Be encouraging but realistic about the content creation journey
- Focus on their unique competitive advantages
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const analysisResult: GeminiAnalysisResult = JSON.parse(jsonMatch[0]);
    return analysisResult;
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    
    // Fallback response in case of API failure
    return {
      personalityProfile: "A unique creator with diverse interests and valuable perspectives to share.",
      topStrengths: ["Authentic Voice", "Diverse Experience", "Unique Perspective"],
      contentAngles: [
        {
          title: "The Authentic Storyteller",
          description: "Share personal experiences and lessons learned",
          examples: ["Behind-the-scenes content", "Personal growth stories", "Life lessons learned"]
        }
      ],
      actionSteps: [
        {
          title: "Week 1-2: Foundation",
          description: "Set up your content creation foundation",
          tasks: ["Choose your primary platform", "Create content calendar", "Design basic brand elements"]
        }
      ],
      platforms: [
        {
          platform: "Instagram",
          why: "Great for visual storytelling and building community",
          tips: ["Post consistently", "Use Stories for behind-the-scenes", "Engage with your audience"]
        }
      ]
    };
  }
} 