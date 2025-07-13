import { QuizAnswer, QuizResult } from '@/types';
import { contentAngles } from './quizData';

export function calculateContentAngles(answers: QuizAnswer[]): QuizResult {
  // Convert answers to a more accessible format
  const answerMap = answers.reduce((acc, answer) => {
    acc[answer.questionId] = answer.answer;
    return acc;
  }, {} as Record<string, string | number | string[]>);

  // Calculate scores for each content angle
  const angleScores = contentAngles.map(angle => {
    let score = 0;
    
    // Helper function to check if answer matches tags (handles both single values and arrays)
    const checkMatch = (answer: string | number | string[] | undefined, points: number) => {
      if (!answer) return;
      
      if (Array.isArray(answer)) {
        // For multi-select answers, check if any selected option matches
        const matches = answer.filter(item => angle.matchingTags.includes(item)).length;
        score += matches * points;
      } else if (typeof answer === 'string' && angle.matchingTags.includes(answer)) {
        score += points;
      }
    };
    
    // Check profession match (highest weight)
    checkMatch(answerMap.profession, 3);
    
    // Check hobby/interest matches (multi-select, so can have multiple matches)
    checkMatch(answerMap.hobbies, 2);
    
    // Check special skills matches
    checkMatch(answerMap['special-skills'], 2);
    
    // Check communication style match
    checkMatch(answerMap['communication-style'], 2);
    
    // Check life experience match
    checkMatch(answerMap['life-experience'], 2);
    
    // Check values alignment (multi-select)
    checkMatch(answerMap.values, 1);
    
    // Check primary niche match
    checkMatch(answerMap['primary-niche'], 1);
    
    // Check platform preferences (multi-select)
    checkMatch(answerMap['platform-preferences'], 0.5);
    
    return { ...angle, score };
  });

  // Sort by score and get top 5
  const topAngles = angleScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(angleWithScore => ({
      id: angleWithScore.id,
      title: angleWithScore.title,
      description: angleWithScore.description,
      examples: angleWithScore.examples,
      matchingTags: angleWithScore.matchingTags
    }));

  // Generate personality profile
  const personalityProfile = generatePersonalityProfile(answerMap);
  
  // Generate top strengths
  const topStrengths = generateTopStrengths(answerMap);

  return {
    angles: topAngles,
    personalityProfile,
    topStrengths
  };
}

function generatePersonalityProfile(answers: Record<string, string | number | string[]>): string {
  const profession = answers.profession as string;
  
  const profiles: Record<string, string> = {
    'Teacher/Educator': 'Natural educator who breaks down complex topics',
    'Healthcare Professional': 'Caring professional focused on helping others',
    'Tech/Engineering': 'Problem-solver who enjoys building and creating',
    'Business/Finance': 'Strategic thinker with entrepreneurial mindset',
    'Creative/Artist': 'Creative visionary who sees beauty in everyday life',
    'Service Industry': 'People-person who understands customer needs',
    'Student': 'Curious learner eager to share discoveries',
    'Other': 'Unique perspective shaped by diverse experiences'
  };
  
  return profiles[profession] || 'Unique individual with distinctive insights';
}

function generateTopStrengths(answers: Record<string, string | number | string[]>): string[] {
  const strengths = [];
  
  // Add strength based on communication style
  const communicationStrengths: Record<string, string> = {
    'Direct and straightforward': 'Clear Communication',
    'Warm and empathetic': 'Emotional Connection',
    'Humorous and entertaining': 'Entertainment Value',
    'Analytical and detailed': 'Detailed Analysis',
    'Inspiring and motivational': 'Inspiration & Motivation',
    'Calm and reassuring': 'Calming Presence'
  };
  
  const communication = answers['communication-style'] as string;
  if (communication && communicationStrengths[communication]) {
    strengths.push(communicationStrengths[communication]);
  }
  
  // Add strength based on profession
  const professionStrengths: Record<string, string> = {
    'Teacher/Educator': 'Educational Content',
    'Healthcare Professional': 'Expert Knowledge',
    'Tech/Engineering': 'Technical Expertise',
    'Business/Finance': 'Business Acumen',
    'Creative/Artist': 'Creative Vision',
    'Service Industry': 'Customer Understanding',
    'Student': 'Fresh Perspective',
    'Other': 'Unique Background'
  };
  
  const profession = answers.profession as string;
  if (profession && professionStrengths[profession]) {
    strengths.push(professionStrengths[profession]);
  }
  
  // Add strength based on values
  const valueStrengths: Record<string, string> = {
    'Authenticity': 'Authentic Voice',
    'Growth/Learning': 'Continuous Learning',
    'Community/Connection': 'Community Building',
    'Excellence/Quality': 'High Standards',
    'Freedom/Independence': 'Independent Thinking',
    'Impact/Purpose': 'Purposeful Content'
  };
  
  const values = answers.values as string;
  if (values && valueStrengths[values]) {
    strengths.push(valueStrengths[values]);
  }
  
  return strengths.slice(0, 3); // Return top 3 strengths
} 