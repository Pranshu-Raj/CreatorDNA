'use client';

import { useState, useEffect } from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string | number | string[]) => void;
  currentAnswer?: string | number | string[];
}

export function QuizQuestion({ question, onAnswer, currentAnswer }: QuizQuestionProps) {
  const [selectedValue, setSelectedValue] = useState<string | number | string[]>(
    currentAnswer || (question.type === 'multi-select' ? [] : '')
  );

  useEffect(() => {
    setSelectedValue(currentAnswer || (question.type === 'multi-select' ? [] : ''));
  }, [currentAnswer, question.type]);

  const handleAnswerChange = (value: string | number | string[]) => {
    setSelectedValue(value);
    onAnswer(value);
  };

  // Helper function to extract selection limit from question text
  const getSelectionLimit = (questionText: string): number | null => {
    const match = questionText.match(/select up to (\d+)/i);
    return match ? parseInt(match[1]) : null;
  };

  const handleMultiSelectChange = (option: string, checked: boolean) => {
    const currentArray = Array.isArray(selectedValue) ? selectedValue : [];
    const selectionLimit = getSelectionLimit(question.question);
    let newArray: string[];
    
    if (checked) {
      // Check if we've reached the selection limit
      if (selectionLimit && currentArray.length >= selectionLimit) {
        return; // Don't add if limit reached
      }
      newArray = [...currentArray, option];
    } else {
      newArray = currentArray.filter(item => item !== option);
    }
    
    handleAnswerChange(newArray);
  };

  if (question.type === 'multiple-choice') {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h3>
        <div className="grid gap-3">
          {question.options?.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedValue === option
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={selectedValue === option}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="mr-3 text-purple-600"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'multi-select') {
    const selectedArray = Array.isArray(selectedValue) ? selectedValue : [];
    const selectionLimit = getSelectionLimit(question.question);
    const isAtLimit = Boolean(selectionLimit && selectedArray.length >= selectionLimit);
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h3>
        <div className="grid gap-3">
          {question.options?.map((option, index) => {
            const isSelected = selectedArray.includes(option);
            const isDisabled = !isSelected && isAtLimit;
            
            return (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={(e) => handleMultiSelectChange(option, e.target.checked)}
                  className="mr-3 text-purple-600 rounded disabled:opacity-50"
                />
                <span className={`${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <p className="text-gray-500">
            Selected: {selectedArray.length} 
            {selectionLimit && ` of ${selectionLimit} maximum`}
            {selectedArray.length !== 1 ? ' items' : ' item'}
          </p>
          {selectionLimit && isAtLimit && (
            <p className="text-amber-600 font-medium">
              Maximum selections reached
            </p>
          )}
        </div>
      </div>
    );
  }

  if (question.type === 'scale') {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">{question.question}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Low Energy</span>
          <div className="flex gap-4">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center justify-center w-12 h-12 border-2 rounded-full cursor-pointer transition-colors ${
                  selectedValue === option
                    ? 'border-purple-500 bg-purple-500 text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={selectedValue === option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="sr-only"
                />
                <span className="font-semibold">{option}</span>
              </label>
            ))}
          </div>
          <span className="text-sm text-gray-500">High Energy</span>
        </div>
      </div>
    );
  }

  if (question.type === 'text') {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{question.question}</h3>
        <textarea
          value={selectedValue}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 placeholder-gray-500"
          rows={4}
          placeholder="Share your thoughts..."
        />
      </div>
    );
  }

  return null;
} 