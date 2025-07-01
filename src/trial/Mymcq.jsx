import React from 'react';
import { useProblems } from '../context/ProblemProvider'; // Adjust path as needed

export default function Mymcq() {
  const {
    selectedSubject,
    setSelectedSubject,
    selectedMcqId,
    setSelectedMcqId,
    currentMcq,
    mcqLoading,
    mcqError,
    clearMcqSelection
  } = useProblems();

  // Programming languages list matching your server structure
  const programmingLanguages = [
    'C Programming',
    'C++ Programming', 
    'Java',
    'Python',
    'Pseudo Code'
  ];

  // Generate MCQ numbers 1-100
  const mcqNumbers = Array.from({ length: 100 }, (_, i) => i + 1);

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleMCQClick = (mcqNo) => {
    setSelectedMcqId(mcqNo);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">MCQ Selector</h1>
      
      {/* Current Selection Display */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2 text-center">Current Selection</h2>
        <div className="text-center">
          <p className="text-lg mb-3">
            <span className="font-medium">Subject:</span> {selectedSubject || 'None selected'} | 
            <span className="font-medium"> MCQ #:</span> {selectedMcqId || 'None selected'}
          </p>
          
          {selectedSubject && selectedMcqId && (
            <button 
              onClick={clearMcqSelection}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* MCQ Display Section */}
      {selectedSubject && selectedMcqId && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border">
          <h3 className="text-xl font-semibold mb-4">
            {selectedSubject} - MCQ #{selectedMcqId}
          </h3>
          
          {mcqLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading MCQ...</span>
            </div>
          )}
          
          {mcqError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {mcqError}
            </div>
          )}
          
          {currentMcq && !mcqLoading && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">Question:</h4>
                <p className="text-gray-800">{currentMcq.question || 'Question not available'}</p>
              </div>
              
              {currentMcq.options && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">Options:</h4>
                  {Object.entries(currentMcq.options).map(([key, value]) => (
                    <div key={key} className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      <span className="font-medium">{key.toUpperCase()}:</span> {value}
                    </div>
                  ))}
                </div>
              )}
              
              {currentMcq.correct_answer && (
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-lg text-green-800">Correct Answer:</h4>
                  <p className="text-green-700">{currentMcq.correct_answer}</p>
                </div>
              )}
              
              {currentMcq.explanation && (
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-lg text-yellow-800">Explanation:</h4>
                  <p className="text-yellow-700">{currentMcq.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Programming Languages List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Programming Languages</h2>
          <div className="grid grid-cols-1 gap-3">
            {programmingLanguages.map((lang, index) => (
              <button
                key={index}
                onClick={() => handleSubjectClick(lang)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left font-medium ${
                  selectedSubject === lang
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                    : 'bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* MCQ Numbers List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">MCQ Numbers (1-100)</h2>
          <div className="grid grid-cols-10 gap-2 max-h-96 overflow-y-auto p-2 bg-gray-50 rounded-lg">
            {mcqNumbers.map((num) => (
              <button
                key={num}
                onClick={() => handleMCQClick(num)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-200 font-medium text-sm ${
                  selectedMcqId === num
                    ? 'bg-green-500 text-white border-green-500 shadow-lg transform scale-110'
                    : 'bg-white hover:bg-green-50 border-gray-300 hover:border-green-300 hover:shadow-md'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}