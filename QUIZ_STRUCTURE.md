# Creator Personality Matcher - Quiz Structure

## Overview
The Creator Personality Matcher uses a 4-step quiz to analyze users' backgrounds, skills, personality traits, and content goals to provide personalized content angle suggestions.

## Quiz Flow

### Step 1: Your Background
**Focus**: Professional and personal background
- Current/recent profession (10 options)
- Years of professional experience (5 ranges)
- Significant life experiences that shaped them
- Optional: Unique background details (text input)

### Step 2: Interests & Skills  
**Focus**: Hobbies, talents, and cultural background
- **Multi-select**: Main hobbies/interests (10 options)
- **Multi-select**: Special skills/talents (10 options)
- Languages spoken fluently
- Cultural background/diversity

### Step 3: Your Personality
**Focus**: Communication style and core traits
- Communication style (6 options)
- Energy level (1-5 scale)
- **Multi-select**: Core values (up to 3 from 8 options)
- Comfort level on camera/public speaking (1-5 scale)

### Step 4: Content Goals
**Focus**: Content creation objectives and preferences
- Primary niche interest (10 options)
- Target audience (8 demographics)
- **Multi-select**: Platform preferences (8 platforms)
- Main content creation goal (7 objectives)

## Question Types Supported

1. **Multiple Choice** - Single selection from options
2. **Multi-Select** - Multiple selections with checkboxes
3. **Scale** - 1-5 rating scale 
4. **Text** - Optional open-ended input

## Technical Implementation

### State Management
- React Context (`QuizContext`) manages quiz state
- Supports navigation between steps
- Persists answers when moving between steps
- Handles validation for step completion

### Validation Rules
- **Multiple choice/Scale**: Must select one option
- **Multi-select**: Must select at least one option
- **Text**: Optional (always valid)

### Matching Algorithm
The algorithm scores content angles based on:
- **Profession match** (3 points) - Highest weight
- **Hobbies/Skills match** (2 points each) - Can have multiple matches
- **Communication style** (2 points)
- **Life experience** (2 points) 
- **Values alignment** (1 point each) - Can have multiple matches
- **Niche match** (1 point)
- **Platform preferences** (0.5 points each) - Can have multiple matches

### Results
- Top 5 content angles based on scoring
- Personality profile summary
- Top 3 personal strengths
- Specific content idea examples for each angle

## File Structure
```
src/
├── app/
│   ├── quiz/step-[step]/page.tsx    # Dynamic quiz step pages
│   ├── results/page.tsx             # Results display
│   └── page.tsx                     # Landing page
├── components/
│   └── QuizQuestion.tsx             # Reusable question component
├── lib/
│   ├── QuizContext.tsx              # State management
│   ├── quizData.ts                  # Question definitions
│   └── matchingAlgorithm.ts         # Content angle matching
└── types/
    └── index.ts                     # TypeScript interfaces
```

## Adding New Questions
1. Add question to appropriate step in `quizData.ts`
2. Update matching algorithm if new tags are needed
3. Ensure validation logic handles the new question type

## Adding New Content Angles
1. Add new `ContentAngle` object to `contentAngles` array
2. Include relevant `matchingTags` that correspond to quiz answers
3. Provide descriptive examples for each angle 