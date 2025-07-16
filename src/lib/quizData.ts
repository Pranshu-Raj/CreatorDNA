import { QuizStep, ContentAngle } from '@/types';

export const quizSteps: QuizStep[] = [
  {
    step: 1,
    title: "Your Background",
    description: "Tell us about your professional and personal background",
    questions: [
      {
        id: "profession",
        question: "What's your current or most recent profession?",
        type: "multiple-choice",
        category: "background",
        options: [
          "Teacher/Educator",
          "Healthcare Professional",
          "Tech/Engineering",
          "Business/Finance",
          "Creative/Artist",
          "Marketing/Communications",
          "Service Industry",
          "Legal/Law",
          "Student",
          "Other"
        ]
      },
      {
        id: "work-experience",
        question: "How many years of professional experience do you have?",
        type: "multiple-choice",
        category: "background",
        options: [
          "0-2 years",
          "3-5 years",
          "6-10 years",
          "11-15 years",
          "16+ years"
        ]
      },
      {
        id: "life-experience",
        question: "What's a significant life experience that shaped you?",
        type: "multiple-choice",
        category: "background",
        options: [
          "Travel/Living abroad",
          "Career change",
          "Parenthood",
          "Health challenges",
          "Starting a business",
          "Education journey",
          "Relationship changes",
          "Personal growth"
        ]
      },
      {
        id: "unique-background",
        question: "What makes your background unique? (Optional)",
        type: "text",
        category: "background"
      }
    ]
  },
  {
    step: 2,
    title: "Interests & Skills",
    description: "Help us understand your hobbies, skills, and cultural background",
    questions: [
      {
        id: "problem-solving-approach",
        question: "When faced with a complex problem, what's your natural approach?",
        type: "multiple-choice",
        category: "interests-skills",
        options: [
          "Break it down into smaller, manageable parts",
          "Look for creative, unconventional solutions",
          "Research what others have done successfully",
          "Collaborate with others to find the best approach"
        ]
      },
      {
        id: "hobbies",
        question: "What are your main hobbies or interests? (Select all that apply)",
        type: "multi-select",
        category: "interests-skills",
        options: [
          "Fitness/Sports",
          "Cooking/Food",
          "Arts/Crafts",
          "Gaming",
          "Reading/Learning",
          "Music",
          "Outdoors/Nature",
          "Technology",
          "Photography",
          "Writing"
        ]
      },
      {
        id: "special-skills",
        question: "Do you have any special skills or talents? (Select all that apply)",
        type: "multi-select",
        category: "interests-skills",
        options: [
          "Public speaking",
          "Writing/Copywriting",
          "Design/Graphic design",
          "Video editing",
          "Photography",
          "Teaching/Explaining",
          "Problem solving",
          "Organization/Planning",
          "Languages",
          "Technical skills"
        ]
      },
      {
        id: "learning-style",
        question: "How do you prefer to learn new things?",
        type: "multiple-choice",
        category: "interests-skills",
        options: [
          "Hands-on practice and experimentation",
          "Reading comprehensive guides and resources",
          "Watching video tutorials and demonstrations",
          "Learning from mentors and experts"
        ]
      },
      {
        id: "cultural-background",
        question: "How would you describe your cultural background?",
        type: "multiple-choice",
        category: "interests-skills",
        options: [
          "Lived in one country/culture",
          "Multicultural background",
          "Immigrant experience",
          "International experience",
          "Diverse community exposure",
          "Traditional cultural roots"
        ]
      },
      {
        id: "cognitive-style",
        question: "When you learn a new topic, what is your typical approach?",
        type: "multiple-choice",
        category: "interests-skills",
        options: [
          "The Deep Dive: I love to go deep, understand all the details, and become an expert in one specific area.",
          "The Connector: I enjoy learning a little about a lot of things and finding interesting connections between different topics."
        ]
      }
    ]
  },
  {
    step: 3,
    title: "Your Personality",
    description: "Help us understand your communication style and personality traits",
    questions: [
      {
        id: "decision-making-style",
        question: "When making important decisions, you tend to:",
        type: "multiple-choice",
        category: "personality",
        options: [
          "Analyze all available data and options carefully",
          "Trust your gut instinct and intuition",
          "Seek advice from trusted friends or mentors",
          "Consider the impact on others before deciding"
        ]
      },
      {
        id: "communication-style",
        question: "How would you describe your communication style?",
        type: "multiple-choice",
        category: "personality",
        options: [
          "Direct and straightforward",
          "Warm and empathetic",
          "Humorous and entertaining",
          "Analytical and detailed",
          "Inspiring and motivational",
          "Calm and reassuring"
        ]
      },
      {
        id: "energy-level",
        question: "What's your natural energy level?",
        type: "scale",
        category: "personality",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "values",
        question: "What values are most important to you? (Select up to 3)",
        type: "multi-select",
        category: "personality",
        options: [
          "Authenticity",
          "Growth/Learning",
          "Community/Connection",
          "Excellence/Quality",
          "Freedom/Independence",
          "Impact/Purpose",
          "Creativity",
          "Stability"
        ]
      },
      {
        id: "comfort-on-camera",
        question: "How comfortable are you being on camera or speaking publicly?",
        type: "scale",
        category: "personality",
        options: ["1", "2", "3", "4", "5"]
      },
      {
        id: "creative-approach",
        question: "Which statement best describes your creative approach?",
        type: "multiple-choice",
        category: "personality",
        options: [
          "I prefer proven formulas and clear, structured paths to get results.",
          "I enjoy experimenting with new ideas, even if they might fail."
        ]
      },
      {
        id: "project-work-style",
        question: "When it comes to projects, I am someone who...",
        type: "multiple-choice",
        category: "personality",
        options: [
          "Thrives on a structured schedule and detailed plans.",
          "Works best with flexible deadlines and bursts of spontaneous energy."
        ]
      },
      {
        id: "feedback-reaction",
        question: "When receiving critical feedback, your first instinct is to:",
        type: "multiple-choice",
        category: "personality",
        options: [
          "Understand the other person's perspective to maintain harmony",
          "Analyze the feedback logically to see if it's factually correct",
          "Reflect on how it applies to your personal growth",
          "Use it as motivation to improve and prove yourself"
        ]
      }
    ]
  },
  {
    step: 4,
    title: "Content Goals",
    description: "Let's understand what kind of content you want to create and who you want to reach",
    questions: [
      {
        id: "content-motivation",
        question: "What motivates you most about creating content?",
        type: "multiple-choice",
        category: "content-goals",
        options: [
          "Sharing knowledge and helping others learn",
          "Building a community of like-minded people",
          "Expressing creativity and unique perspectives",
          "Establishing expertise in your field"
        ]
      },
      {
        id: "primary-niche",
        question: "What's your primary niche interest?",
        type: "multiple-choice",
        category: "content-goals",
        options: [
          "Lifestyle/Personal Development",
          "Business/Entrepreneurship",
          "Health/Fitness",
          "Education/Learning",
          "Entertainment",
          "Technology",
          "Food/Cooking",
          "Fashion/Beauty",
          "Travel",
          "Parenting/Family"
        ]
      },
      {
        id: "target-audience",
        question: "Who do you primarily want to help?",
        type: "multiple-choice",
        category: "content-goals",
        options: [
          "Young professionals (22-35)",
          "Parents/Families",
          "Students/Graduates",
          "Entrepreneurs/Business owners",
          "People in career transition",
          "Hobbyists/Enthusiasts",
          "Seniors (50+)",
          "General audience"
        ]
      },
      {
        id: "platform-preferences",
        question: "Which platforms interest you most? (Select all that apply)",
        type: "multi-select",
        category: "content-goals",
        options: [
          "YouTube (long-form video)",
          "TikTok/Instagram Reels (short video)",
          "Instagram (photos/stories)",
          "Blog/Newsletter",
          "Podcast",
          "LinkedIn",
          "Twitter/X",
          "Facebook"
        ]
      },
      {
        id: "resilience-mindset",
        question: "Imagine you spend a week on a piece of content and it gets almost no views. What's your most likely reaction?",
        type: "multiple-choice",
        category: "content-goals",
        options: [
          "Analyze what went wrong and iterate quickly",
          "Feel discouraged but try again with a different approach",
          "Stay focused on the long-term vision and keep going",
          "Seek feedback from others to understand what happened"
        ]
      },
      {
        id: "content-goals",
        question: "What's your main goal with content creation?",
        type: "multiple-choice",
        category: "content-goals",
        options: [
          "Build a personal brand",
          "Generate income/business",
          "Help others/make impact",
          "Share knowledge/expertise",
          "Creative expression",
          "Build a community",
          "Career advancement"
        ]
      }
    ]
  }
];

export const contentAngles: ContentAngle[] = [
  {
    id: "teacher-cooking",
    title: "The Classroom Chef",
    description: "Teaching cooking concepts like classroom lessons with step-by-step explanations",
    examples: [
      "Breaking down knife skills into 'lessons'",
      "Cooking science explanations",
      "Meal prep 'homework' assignments"
    ],
    matchingTags: ["Teacher/Educator", "Cooking/Food", "Analytical and detailed"]
  },
  {
    id: "healthcare-wellness",
    title: "The Wellness Insider",
    description: "Sharing health insights from a professional perspective with empathy",
    examples: [
      "Debunking health myths with expertise",
      "Stress management for busy professionals",
      "Preventive care tips from the frontlines"
    ],
    matchingTags: ["Healthcare Professional", "Health/Fitness", "Warm and empathetic"]
  },
  {
    id: "tech-simplifier",
    title: "The Tech Translator",
    description: "Making complex technology accessible to everyday people",
    examples: [
      "Explaining new apps in simple terms",
      "Tech reviews for non-tech people",
      "Digital life hacks and shortcuts"
    ],
    matchingTags: ["Tech/Engineering", "Technology", "Direct and straightforward"]
  },
  {
    id: "business-storyteller",
    title: "The Entrepreneur's Journey",
    description: "Sharing business lessons through personal stories and failures",
    examples: [
      "Behind-the-scenes of starting a business",
      "Money mindset shifts from experience",
      "Leadership lessons from real situations"
    ],
    matchingTags: ["Business/Finance", "Business/Entrepreneurship", "Inspiring and motivational"]
  },
  {
    id: "creative-process",
    title: "The Creative Process Explorer",
    description: "Documenting the creative journey and artistic techniques",
    examples: [
      "Time-lapse art creation videos",
      "Creative block solutions",
      "Art therapy and emotional expression"
    ],
    matchingTags: ["Creative/Artist", "Arts/Crafts", "Authenticity"]
  },
  {
    id: "fitness-motivator",
    title: "The Relatable Fitness Guide",
    description: "Fitness content that acknowledges real-life struggles and limitations",
    examples: [
      "Workouts for busy schedules",
      "Fitness for beginners without shame",
      "Mental health benefits of movement"
    ],
    matchingTags: ["Fitness/Sports", "Health/Fitness", "Warm and empathetic"]
  },
  {
    id: "travel-educator",
    title: "The Cultural Bridge Builder",
    description: "Travel content focused on cultural learning and understanding",
    examples: [
      "Language learning through travel",
      "Cultural etiquette guides",
      "Budget travel with educational value"
    ],
    matchingTags: ["Travel/Living abroad", "Education/Learning", "Growth/Learning"]
  },
  {
    id: "parent-content",
    title: "The Real Parent Chronicles",
    description: "Honest parenting content that shows both struggles and wins",
    examples: [
      "Parent life hacks for survival",
      "Teaching kids life skills",
      "Maintaining identity as a parent"
    ],
    matchingTags: ["Parenthood", "Parents/Families", "Authenticity"]
  }
]; 