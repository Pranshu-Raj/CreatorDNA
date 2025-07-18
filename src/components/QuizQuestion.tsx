'use client';

import { useState } from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string | number | string[]) => void;
  currentAnswer?: string | number | string[];
}

export function QuizQuestion({ question, onAnswer, currentAnswer }: QuizQuestionProps) {
  const [otherText, setOtherText] = useState('');
  const [otherError, setOtherError] = useState('');

  const handleAnswerChange = (value: string | number | string[]) => {
    if (question.type === 'multiple-choice') {
      const stringValue = value as string;
      if (stringValue === 'other') {
        setOtherError('');
        return;
      }
      if (stringValue.startsWith('Other: ')) {
        setOtherText(stringValue.replace('Other: ', ''));
      } else {
        setOtherText('');
      }
    }
    onAnswer(value);
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    setOtherError('');
    if (text.trim()) {
      onAnswer(`Other: ${text.trim()}`);
    } else {
      onAnswer('other');
    }
  };

  const validateOther = () => {
    if (currentAnswer === 'other' && !otherText.trim()) {
      setOtherError('Please specify your answer');
      return false;
    }
    return true;
  };

  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => {
        const isSelected = currentAnswer === option || currentAnswer === 'other' && option === 'Other';
        const isOtherSelected = currentAnswer === 'other' || (typeof currentAnswer === 'string' && currentAnswer.startsWith('Other: '));
        
        return (
          <div key={index}>
            <label className="group cursor-pointer">
                          <div className={`gamified-card p-4 transition-all duration-300 ${
              isSelected 
                ? 'bg-emerald-500 text-white shadow-lg transform scale-105' 
                : 'bg-white text-gray-700 hover:bg-green-50 hover:border-green-200'
            }`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(option === 'Other' ? 'other' : option)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    isSelected 
                      ? 'border-white bg-white' 
                      : 'border-gray-300 group-hover:border-green-400'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                  </div>
                  <span className="font-medium">{option}</span>
                  {option !== 'Other' && (
                    <span className="ml-auto text-2xl">
                      {index === 0 ? '🎯' : index === 1 ? '🌟' : index === 2 ? '🚀' : index === 3 ? '💡' : '✨'}
                    </span>
                  )}
                </div>
              </div>
            </label>
            
            {option === 'Other' && isOtherSelected && (
              <div className="mt-3 ml-8">
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => handleOtherTextChange(e.target.value)}
                  placeholder="Please specify..."
                  className="input-field w-full"
                />
                {otherError && (
                  <p className="text-red-600 text-sm mt-1">{otherError}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderMultiSelect = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => {
        const selectedArray = (currentAnswer as string[]) || [];
        const isSelected = selectedArray.includes(option);
        
        return (
          <label key={index} className="group cursor-pointer">
            <div className={`gamified-card p-4 transition-all duration-300 ${
              isSelected 
                ? 'bg-emerald-500 text-white shadow-lg transform scale-105' 
                : 'bg-white text-gray-700 hover:bg-green-50 hover:border-green-200'
            }`}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name={question.id}
                  value={option}
                  checked={isSelected}
                  onChange={(e) => {
                    const newSelection = e.target.checked
                      ? [...selectedArray, option]
                      : selectedArray.filter(item => item !== option);
                    handleAnswerChange(newSelection);
                  }}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center ${
                  isSelected 
                    ? 'border-white bg-white' 
                                         : 'border-gray-300 group-hover:border-green-400'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{option}</span>
                <span className="ml-auto text-2xl">
                  {index === 0 ? '🎨' : index === 1 ? '🎪' : index === 2 ? '🎭' : index === 3 ? '🎯' : index === 4 ? '🌟' : '✨'}
                </span>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );

  const renderScale = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((value) => {
          const isSelected = currentAnswer === value;
          return (
            <label key={value} className="cursor-pointer">
              <div className={`gamified-card p-4 text-center transition-all duration-300 ${
                isSelected 
                  ? 'bg-emerald-500 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:border-green-200'
              }`}>
                <input
                  type="radio"
                  name={question.id}
                  value={value}
                  checked={isSelected}
                  onChange={() => handleAnswerChange(value)}
                  className="sr-only"
                />
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs mt-1">
                  {value === 1 ? '🌱' : value === 2 ? '🌿' : value === 3 ? '🌳' : value === 4 ? '🌲' : '🌟'}
                </div>
              </div>
            </label>
          );
        })}
      </div>
      <div className="flex justify-between text-sm text-gray-600 px-2">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );

  const renderText = () => (
    <div className="space-y-4">
      <textarea
        value={currentAnswer as string || ''}
        onChange={(e) => handleAnswerChange(e.target.value)}
        placeholder="Share your thoughts..."
        className="input-field w-full h-32 resize-none"
      />
      <div className="text-sm text-gray-500 flex items-center">
        <span className="mr-2">💭</span>
        This is optional - share as much or as little as you'd like
      </div>
    </div>
  );

  return (
    <div className="gamified-card p-6 lg:p-8">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">?</span>
          </div>
          <h2 className="text-heading font-bold text-gray-900">{question.question}</h2>
        </div>
        

      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.type === 'multiple-choice' && renderMultipleChoice()}
        {question.type === 'multi-select' && renderMultiSelect()}
        {question.type === 'scale' && renderScale()}
        {question.type === 'text' && renderText()}
      </div>

      {/* Answer Count for Multi-Select */}
      {question.type === 'multi-select' && (
        <div className="mt-4 text-sm text-gray-500 bg-teal-50 p-3 rounded-xl">
          <span className="mr-2">📊</span>
          {((currentAnswer as string[]) || []).length} selected
        </div>
      )}
    </div>
  );
} 