import React from 'react';
import { useProblems } from '../context/ProblemProvider'; // Adjust path as needed

export default function Mymcq() {
  const { 
    mcqs, 
    mcqLoading, 
    mcqError, 
    fetchAllMcqs, 
    refetchMcqs,
    clearMcqCache,
    mcqsLastFetch,
    isMcqCacheValid 
  } = useProblems();

  if (mcqLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading MCQs...</span>
        </div>
      </div>
    );
  }

  if (mcqError) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {mcqError}
        </div>
        <button 
          onClick={fetchAllMcqs}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={mcqLoading}
        >
          {mcqLoading ? 'Retrying...' : 'Retry Fetch MCQs'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">MCQ Questions ({mcqs.length})</h1>
          {mcqsLastFetch && (
            <p className="text-sm text-gray-500">
              {isMcqCacheValid ? '💾 From cache' : '🌐 From server'} • 
              Last updated: {mcqsLastFetch.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => refetchMcqs()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
            disabled={mcqLoading}
          >
            {mcqLoading ? 'Loading...' : '🔄 Force Refresh'}
          </button>
          <button 
            onClick={clearMcqCache}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
            disabled={mcqLoading}
          >
            🗑️ Clear Cache
          </button>
        </div>
      </div>
      
      {mcqs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No MCQs available
        </div>
      ) : (
        <div className="space-y-6">
          {mcqs.map((mcq, index) => (
            <div key={`mcq-${index}-${mcq.id || mcq.index || Math.random()}`} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {/* Question Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {mcq.subject || 'Unknown Subject'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Index: {mcq.index}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Q{index + 1}: {mcq.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2 mb-4">
                <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                  <span className="font-medium">A) </span>{mcq.option1}
                </div>
                <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                  <span className="font-medium">B) </span>{mcq.option2}
                </div>
                <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                  <span className="font-medium">C) </span>{mcq.option3}
                </div>
                <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                  <span className="font-medium">D) </span>{mcq.option4}
                </div>
              </div>

              {/* Answer */}
              <div className="mb-4">
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                  <span className="font-medium text-green-800">
                    Correct Answer: Option {mcq.ans}
                  </span>
                </div>
              </div>

              {/* Solution (if available) */}
              {(mcq.solution || mcq.Solution) && (
                <div className="mb-4">
                  <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <span className="font-medium text-blue-800">Solution: </span>
                    <span className="text-blue-700">
                      {mcq.solution || mcq.Solution}
                    </span>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="text-xs text-gray-500 border-t pt-3 mt-4">
                <div className="flex flex-wrap gap-4">
                  <span>Added by: {mcq.addedBy}</span>
                  <span>Added: {new Date(mcq.addedDate).toLocaleDateString()}</span>
                  <span>ID: {mcq.id}</span>
                  {mcq.verified && <span className="text-green-600">✓ Verified</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <p>Total MCQs: {mcqs.length}</p>
        <p>Loading: {mcqLoading ? 'Yes' : 'No'}</p>
        <p>Error: {mcqError || 'None'}</p>
        
        {mcqs.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer font-medium">Raw Data (First MCQ)</summary>
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
              {JSON.stringify(mcqs[0], null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}