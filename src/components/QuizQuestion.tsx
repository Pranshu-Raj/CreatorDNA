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
  const [otherText, setOtherText] = useState<string>('');

  useEffect(() => {
    setSelectedValue(currentAnswer || (question.type === 'multi-select' ? [] : ''));
    // If current answer is "Other: something", extract the text part
    if (typeof currentAnswer === 'string' && currentAnswer.startsWith('Other: ')) {
      setOtherText(currentAnswer.replace('Other: ', ''));
    }
  }, [currentAnswer, question.type]);

  const handleAnswerChange = (value: string | number | string[]) => {
    setSelectedValue(value);
    onAnswer(value);
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    if (text.trim()) {
      handleAnswerChange(`Other: ${text.trim()}`);
    } else {
      handleAnswerChange('Other');
    }
  };

  const handleMultiSelectChange = (option: string, checked: boolean) => {
    const currentArray = Array.isArray(selectedValue) ? selectedValue : [];
    const selectionLimit = getSelectionLimit(question.question);
    let newArray: string[];
    
    if (checked) {
      if (selectionLimit && currentArray.length >= selectionLimit) {
        return;
      }
      newArray = [...currentArray, option];
    } else {
      newArray = currentArray.filter(item => item !== option);
    }
    
    handleAnswerChange(newArray);
  };

  const getSelectionLimit = (questionText: string): number | null => {
    const match = questionText.match(/select up to (\d+)/i);
    return match ? parseInt(match[1]) : null;
  };

  const isOtherSelected = () => {
    if (question.type === 'multiple-choice') {
      return selectedValue === 'Other' || (typeof selectedValue === 'string' && selectedValue.startsWith('Other: '));
    }
    return false;
  };

  const hasOtherOption = () => {
    return question.options?.includes('Other') || false;
  };

  if (question.type === 'multiple-choice') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center">
            {question.question}
          </h1>

          <div className="grid gap-3 max-w-2xl mx-auto">
            {question.options?.map((option, index) => (
              <div key={index}>
                <label
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedValue === option || (option === 'Other' && isOtherSelected())
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={selectedValue === option || (option === 'Other' && isOtherSelected())}
                    onChange={(e) => {
                      if (option === 'Other') {
                        setSelectedValue('Other');
                        if (otherText.trim()) {
                          handleAnswerChange(`Other: ${otherText.trim()}`);
                        } else {
                          handleAnswerChange('Other');
                        }
                      } else {
                        handleAnswerChange(e.target.value);
                        setOtherText('');
                      }
                    }}
                    className="sr-only"
                  />
                  <span className="text-lg font-medium">{option}</span>
                </label>
                
                {/* Show input field when "Other" is selected */}
                {option === 'Other' && isOtherSelected() && (
                  <div className="mt-2 ml-4">
                    <input
                      type="text"
                      value={otherText}
                      onChange={(e) => handleOtherTextChange(e.target.value)}
                      placeholder="Please specify..."
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                      required
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (question.type === 'multi-select') {
    const selectedArray = Array.isArray(selectedValue) ? selectedValue : [];
    const selectionLimit = getSelectionLimit(question.question);
    const isAtLimit = Boolean(selectionLimit && selectedArray.length >= selectionLimit);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center">
            {question.question}
          </h1>

          <div className="grid gap-3 max-w-2xl mx-auto">
            {question.options?.map((option, index) => {
              const isSelected = selectedArray.includes(option);
              const isDisabled = !isSelected && isAtLimit;
              
              return (
                <label
                  key={index}
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-green-500 text-white shadow-lg'
                      : isDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 shadow-sm cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={(e) => handleMultiSelectChange(option, e.target.checked)}
                    className="sr-only"
                  />
                  <span className="text-lg font-medium">{option}</span>
                </label>
              );
            })}
          </div>

          {selectionLimit && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Selected: {selectedArray.length} of {selectionLimit} maximum
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (question.type === 'scale') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
            {question.question}
          </h1>

          <div className="flex items-center justify-center space-x-4">
            <span className="text-sm text-gray-500">Low Energy</span>
            <div className="flex space-x-3">
              {question.options?.map((option, index) => (
                <label
                  key={index}
                  className={`w-14 h-14 rounded-full border-3 flex items-center justify-center cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                    selectedValue === option
                      ? 'border-purple-500 bg-purple-500 text-white shadow-lg'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white'
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
                  <span className="text-lg font-bold">{option}</span>
                </label>
              ))}
            </div>
            <span className="text-sm text-gray-500">High Energy</span>
          </div>
        </div>
      </div>
    );
  }

  if (question.type === 'text') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center">
            {question.question}
          </h1>

          <div className="max-w-2xl mx-auto">
            <textarea
              value={selectedValue}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full h-32 p-4 border-3 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-900 placeholder-gray-500 text-lg resize-none"
              placeholder="Share your thoughts..."
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
} 