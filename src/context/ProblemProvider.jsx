// src/context/ProblemProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";

// 🌱 Create the context
const ProblemContext = createContext();

// 🎣 Custom hook to use this context
export const useProblems = () => useContext(ProblemContext);

// 🌍 Provider component
export const ProblemProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🆕 New states bro!
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMcqId, setSelectedMcqId] = useState(null);

  // 🆕 MCQ specific states
  const [currentMcq, setCurrentMcq] = useState(null);
  const [mcqLoading, setMcqLoading] = useState(false);
  const [mcqError, setMcqError] = useState("");

  // 🔍 Fetch function for problems
  const fetchAllProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://api-e5q6islzdq-uc.a.run.app/getallproblems");
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setProblems(data.data);
        setError("");
        console.log(`✅ Fetched ${data.data.length} problems`);
      } else {
        setError("Invalid data received from API");
      }
    } catch (err) {
      console.error("❌ Error fetching problems:", err);
      setError("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Function to convert display subject to API format
  const convertSubjectToApiFormat = (subject) => {
    const subjectMap = {
      'C Programming': 'c_programming',
      'C++ Programming': 'c++_programming',
      'Java': 'java',
      'Python': 'python',
      'Pseudo Code': 'pseudo_code'
    };
    return subjectMap[subject] || subject.toLowerCase().replace(/\s+/g, '_');
  };

  // 🆕 Fetch MCQ function
  const fetchMcq = async (subject, mcqId) => {
    if (!subject || !mcqId) {
      setMcqError("Subject and MCQ ID are required");
      return;
    }

    try {
      setMcqLoading(true);
      setMcqError("");
      
      // Convert subject to API format
      const apiSubject = convertSubjectToApiFormat(subject);
      
      // Construct API URL
      const apiUrl = `https://api-e5q6islzdq-uc.a.run.app/getmcq?subject=${apiSubject}&id=${mcqId}`;
      
      console.log(`🔍 Fetching MCQ: ${apiUrl}`);
      
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.success) {
        setCurrentMcq(data.data);
        setMcqError("");
        console.log(`✅ Fetched MCQ for ${subject} #${mcqId}:`, data.data);
      } else {
        setMcqError(data.message || "Failed to fetch MCQ");
        setCurrentMcq(null);
      }
    } catch (err) {
      console.error("❌ Error fetching MCQ:", err);
      setMcqError("Failed to fetch MCQ");
      setCurrentMcq(null);
    } finally {
      setMcqLoading(false);
    }
  };

  // 🆕 Auto-fetch MCQ when subject and ID are selected
  useEffect(() => {
    if (selectedSubject && selectedMcqId) {
      fetchMcq(selectedSubject, selectedMcqId);
    } else {
      setCurrentMcq(null);
      setMcqError("");
    }
  }, [selectedSubject, selectedMcqId]);

  // 🆕 Clear MCQ selection function
  const clearMcqSelection = () => {
    setSelectedSubject(null);
    setSelectedMcqId(null);
    setCurrentMcq(null);
    setMcqError("");
  };

  // 🔁 Fetch on mount
  useEffect(() => {
    fetchAllProblems();
  }, []);

  const contextValue = {
    // Original functionality
    problems,
    loading,
    error,
    refetchProblems: fetchAllProblems,
    
    // MCQ selection states
    selectedSubject,
    setSelectedSubject,
    selectedMcqId,
    setSelectedMcqId,
    
    // MCQ data and loading states
    currentMcq,
    mcqLoading,
    mcqError,
    
    // MCQ functions
    fetchMcq,
    clearMcqSelection,
  };

  return (
    <ProblemContext.Provider value={contextValue}>
      {children}
    </ProblemContext.Provider>
  );
};