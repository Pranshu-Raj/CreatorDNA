'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizState, QuizAnswer } from '@/types';

interface QuizContextType {
  state: QuizState;
  addAnswer: (answer: QuizAnswer) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const initialState: QuizState = {
  currentStep: 1,
  answers: [],
  isComplete: false,
};

type QuizAction =
  | { type: 'ADD_ANSWER'; payload: QuizAnswer }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET_QUIZ' };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ADD_ANSWER':
      // Remove existing answer for the same question if any
      const filteredAnswers = state.answers.filter(
        (answer) => answer.questionId !== action.payload.questionId
      );
      return {
        ...state,
        answers: [...filteredAnswers, action.payload],
      };
    case 'NEXT_STEP':
      const nextStep = state.currentStep + 1;
      return {
        ...state,
        currentStep: nextStep,
        isComplete: nextStep > 4, // We have 4 steps
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1),
        isComplete: false,
      };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const addAnswer = (answer: QuizAnswer) => {
    dispatch({ type: 'ADD_ANSWER', payload: answer });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        addAnswer,
        nextStep,
        prevStep,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
} 