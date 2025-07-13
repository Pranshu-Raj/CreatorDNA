export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'multi-select' | 'text' | 'scale';
  options?: string[];
  category: 'background' | 'interests-skills' | 'personality' | 'content-goals';
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number | string[];
}

export interface QuizState {
  currentStep: number;
  answers: QuizAnswer[];
  isComplete: boolean;
}

export interface ContentAngle {
  id: string;
  title: string;
  description: string;
  examples: string[];
  matchingTags: string[];
}

export interface QuizResult {
  angles: ContentAngle[];
  personalityProfile: string;
  topStrengths: string[];
}

export interface QuizStep {
  step: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
} 