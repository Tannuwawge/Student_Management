import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Code, CheckCircle, XCircle } from 'lucide-react';

// Mock theme provider - replace with your actual theme context
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return { theme, setTheme };
};

// Mock context for demonstration - replace with your actual useProblems hook
const useProblems = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMcqId, setSelectedMcqId] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Mock MCQ data
  const currentMcq = selectedSubject && selectedMcqId ? {
    question: "What is the correct way to declare a variable in C++?",
    code: `// Example code
int main() {
    // Which declaration is correct?
    return 0;
}`,
    options: {
      a: "int variable_name;",
      b: "variable_name int;", 
      c: "declare int variable_name;",
      d: "var int variable_name;"
    },
    correct_answer: "a",
    explanation: "In C++, variables are declared with the data type followed by the variable name."
  } : null;

  return {
    selectedSubject,
    setSelectedSubject,
    selectedMcqId, 
    setSelectedMcqId,
    currentMcq,
    mcqLoading: false,
    mcqError: null,
    selectedAnswer,
    setSelectedAnswer,
    showAnswer,
    setShowAnswer,
    clearMcqSelection: () => {
      setSelectedSubject(null);
      setSelectedMcqId(null);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };
};

export default function CompactMcqSelector() {
  const { theme } = useTheme();
  const {
    selectedSubject,
    setSelectedSubject,
    selectedMcqId,
    setSelectedMcqId,
    currentMcq,
    mcqLoading,
    mcqError,
    selectedAnswer,
    setSelectedAnswer,
    showAnswer,
    setShowAnswer,
    clearMcqSelection
  } = useProblems();

  const [currentPage, setCurrentPage] = useState(0);
  
  const programmingLanguages = [
    'C Programming', 
    'C++', 
    'Java', 
    'Python', 
    'Pseudo Code'
  ];

  const mcqsPerPage = 20;
  const totalMcqs = 60;
  const totalPages = Math.ceil(totalMcqs / mcqsPerPage);
  
  const getCurrentPageMcqs = () => {
    const start = currentPage * mcqsPerPage + 1;
    const end = Math.min((currentPage + 1) * mcqsPerPage, totalMcqs);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setSelectedMcqId(null);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleMCQClick = (mcqNo) => {
    setSelectedMcqId(mcqNo);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    setShowAnswer(true);
  };

  const isCorrect = showAnswer && selectedAnswer === currentMcq?.correct_answer;

  // Theme-based classes
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBgClass = isDark ? 'bg-gray-800' : 'bg-white';
  const textClass = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDark ? 'text-gray-300' : 'text-gray-600';
  const borderClass = isDark ? 'border-gray-700' : 'border-gray-200';
  console.log("hello  ",selectedSubject)
  return (
    <div className={`  ${bgClass} `}>
      <div className="max-w-8xl mx-auto mt-1 p-2"> 
     
        
        <div className="grid grid-cols-12 gap-4">
          {/* Subject Selection - Col 3 */}
          <div className="col-span-12 md:col-span-3">
            <div className={`${cardBgClass} rounded-lg shadow-sm border ${borderClass} p-4 h-fit`}>
              <h2 className={`text-lg font-semibold mb-4 ${textClass}`}>Subjects</h2>
              <div className="space-y-2">
                {programmingLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleSubjectClick(lang)}
                    className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                      selectedSubject === lang
                        ? 'bg-blue-500 text-white shadow-md'
                        : isDark
                        ? 'bg-gray-700 text-gray-200 hover:bg-blue-600 hover:text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              
              {/* Clear Selection */}
              {selectedSubject && (
                <button 
                  onClick={clearMcqSelection}
                  className={`w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDark 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* MCQ Numbers and Content - Col 9 */}
          <div className="col-span-12 md:col-span-9 space-y-4">
            {/* MCQ Numbers Selection */}
            {selectedSubject && (
              <div className={`${cardBgClass} rounded-md border ${borderClass} p-2`}>
                 <div className="flex items-center justify-between mb-2 text-sm">
                  <h2 className={`text-lg font-semibold ${textClass}`}>
                    Select MCQ (1-{totalMcqs})
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className={`p-2 rounded-md transition-colors ${
                        isDark 
                          ? 'hover:bg-gray-700 disabled:opacity-50' 
                          : 'hover:bg-gray-100 disabled:opacity-50'
                      } disabled:cursor-not-allowed`}
                    >
                      <ChevronLeft size={20} className={textSecondaryClass} />
                    </button>
                    <span className={`text-sm ${textSecondaryClass} px-2`}>
                      {currentPage + 1}/{totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                      className={`p-2 rounded-md transition-colors ${
                        isDark 
                          ? 'hover:bg-gray-700 disabled:opacity-50' 
                          : 'hover:bg-gray-100 disabled:opacity-50'
                      } disabled:cursor-not-allowed`}
                    >
                      <ChevronRight size={20} className={textSecondaryClass} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-10 gap-2">
                  {getCurrentPageMcqs().map((num) => (
                    <button
                      key={num}
                      onClick={() => handleMCQClick(num)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        selectedMcqId === num
                          ? 'bg-green-500 text-white shadow-md transform scale-105'
                          : isDark
                          ? 'bg-gray-700 text-gray-200 hover:bg-green-600 hover:text-white hover:shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600 hover:shadow-sm'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Selection Status */}
            {selectedSubject && selectedMcqId && (
              <div className={`rounded-lg border p-3 ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-900/20 to-green-900/20 border-gray-700' 
                  : 'bg-gradient-to-r from-blue-50 to-green-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={`text-sm font-medium ${textClass}`}>
                      {selectedSubject} - Question #{selectedMcqId}
                    
                    </span>
                  </div>
                </div>
              </div>  
            )}

            {/* MCQ Display */}
            {currentMcq && (
              <div className={`${cardBgClass} rounded-lg shadow-sm border ${borderClass} overflow-hidden`}>
                {/* Question Header */}
                <div className={`px-6 py-4 border-b ${borderClass} ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Code size={20} className="text-blue-500" />
                    <span className={`font-semibold ${textClass}`}>
                      {selectedSubject} - Question #{selectedMcqId}
                    </span>
                  </div>
                  <p className={`leading-relaxed ${textClass}`}>{currentMcq.question}</p>
                </div>

                {/* Code Section */}
                {currentMcq.code && (
                  <div className={`px-6 py-4 ${isDark ? 'bg-black' : 'bg-gray-900'} text-gray-100`}>
                    <pre className="text-sm overflow-x-auto text-left">
                      <code>{currentMcq.code}</code>
                    </pre>
                  </div>
                )}

                {/* Options */}
                <div className="p-6">
                  <h4 className={`font-semibold mb-4 ${textClass}`}>Choose your answer:</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
                    {Object.entries(currentMcq.options).map(([key, value]) => {
                      const isSelected = selectedAnswer === key;
                      const isCorrectAnswer = showAnswer && key === currentMcq.correct_answer;
                      const isWrongAnswer = showAnswer && isSelected && key !== currentMcq.correct_answer;
                      
                      return (
                        <button
                          key={key}
                          onClick={() => !showAnswer && handleAnswerClick(key)}
                          disabled={showAnswer}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            isCorrectAnswer
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : isWrongAnswer
                              ? 'bg-red-50 border-red-500 text-red-700'
                              : isSelected
                              ? isDark
                                ? 'bg-blue-900/50 border-blue-500 text-blue-300'
                                : 'bg-blue-50 border-blue-500 text-blue-700'
                              : isDark
                              ? `bg-gray-700 border-gray-600 text-gray-200 hover:border-blue-500 hover:bg-blue-900/30`
                              : `bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50`
                          } ${showAnswer ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full text-sm font-bold flex items-center justify-center ${
                              isCorrectAnswer
                                ? 'bg-green-500 text-white'
                                : isWrongAnswer
                                ? 'bg-red-500 text-white'
                                : isSelected
                                ? 'bg-blue-500 text-white'
                                : isDark
                                ? 'bg-gray-600 text-gray-200'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {key.toUpperCase()}
                            </span>
                            <span className="flex-1">{value}</span>
                            {showAnswer && isCorrectAnswer && (
                              <CheckCircle size={20} className="text-green-500" />
                            )}
                            {showAnswer && isWrongAnswer && (
                              <XCircle size={20} className="text-red-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit Button */}
                  {selectedAnswer && !showAnswer && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleSubmitAnswer}
                        className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}

                  {/* Result */}
                  {showAnswer && (
                    <div className={`p-4 rounded-lg ${
                      isCorrect 
                        ? isDark 
                          ? 'bg-green-900/20 border border-green-700' 
                          : 'bg-green-50 border border-green-200'
                        : isDark 
                          ? 'bg-red-900/20 border border-red-700' 
                          : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle size={24} className="text-green-500" />
                        ) : (
                          <XCircle size={24} className="text-red-500" />
                        )}
                        <span className={`font-semibold ${
                          isCorrect 
                            ? isDark ? 'text-green-400' : 'text-green-700'
                            : isDark ? 'text-red-400' : 'text-red-700'
                        }`}>
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      
                      {!isCorrect && (
                        <p className={`text-sm mb-2 ${textSecondaryClass}`}>
                          Correct answer: <span className="font-medium">{currentMcq.correct_answer.toUpperCase()}</span>
                        </p>
                      )}
                      
                      {currentMcq.explanation && (
                        <div className={`mt-3 p-3 rounded border-l-4 ${
                          isDark 
                            ? 'bg-blue-900/20 border-blue-500 text-blue-300' 
                            : 'bg-blue-50 border-blue-400 text-blue-800'
                        }`}>
                          <p className="text-sm">
                            <span className="font-medium">Explanation:</span> {currentMcq.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {mcqLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className={`ml-2 ${textSecondaryClass}`}>Loading MCQ...</span>
              </div>
            )}

            {mcqError && (
              <div className={`border px-4 py-3 rounded-lg ${
                isDark 
                  ? 'bg-red-900/20 border-red-700 text-red-400' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <strong>Error:</strong> {mcqError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}