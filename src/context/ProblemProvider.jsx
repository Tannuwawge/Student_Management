// src/context/ProblemProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";

// Create the context
const ProblemContext = createContext();

// Custom hook to use this context
export const useProblems = () => useContext(ProblemContext);

// Provider component
export const ProblemProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mcqLoading, setMcqLoading] = useState(false);
  const [error, setError] = useState("");
  const [mcqError, setMcqError] = useState("");
  const [mcqsLastFetch, setMcqsLastFetch] = useState(null);

  // 🔧 localStorage keys
  const MCQ_STORAGE_KEY = 'cached_mcqs';
  const MCQ_TIMESTAMP_KEY = 'mcqs_last_fetch';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // 🗄️ Check if MCQs are cached and still valid
  const isMcqCacheValid = () => {
    const timestamp = localStorage.getItem(MCQ_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const now = Date.now();
    const lastFetch = parseInt(timestamp);
    return (now - lastFetch) < CACHE_DURATION;
  };

  // 💾 Load MCQs from localStorage
  const loadMcqsFromCache = () => {
    try {
      const cachedMcqs = localStorage.getItem(MCQ_STORAGE_KEY);
      const timestamp = localStorage.getItem(MCQ_TIMESTAMP_KEY);
      
      if (cachedMcqs && timestamp) {
        const parsedMcqs = JSON.parse(cachedMcqs);
        setMcqs(parsedMcqs);
        setMcqsLastFetch(new Date(parseInt(timestamp)));
        console.log(`✅ Loaded ${parsedMcqs.length} MCQs from cache`);
        return true;
      }
    } catch (err) {
      console.warn("Failed to load MCQs from cache:", err);
      // Clear corrupted cache
      localStorage.removeItem(MCQ_STORAGE_KEY);
      localStorage.removeItem(MCQ_TIMESTAMP_KEY);
    }
    return false;
  };

  // 💾 Save MCQs to localStorage  
  const saveMcqsToCache = (mcqData) => {
    try {
      const timestamp = Date.now();
      localStorage.setItem(MCQ_STORAGE_KEY, JSON.stringify(mcqData));
      localStorage.setItem(MCQ_TIMESTAMP_KEY, timestamp.toString());
      setMcqsLastFetch(new Date(timestamp));
      console.log(`✅ Cached ${mcqData.length} MCQs to localStorage`);
    } catch (err) {
      console.warn("Failed to cache MCQs:", err);
      // Handle storage quota exceeded
      if (err.name === 'QuotaExceededError') {
        setMcqError("Storage quota exceeded. Please clear browser data.");
      }
    }
  };

  // 🗑️ Clear MCQ cache
  const clearMcqCache = () => {
    localStorage.removeItem(MCQ_STORAGE_KEY);
    localStorage.removeItem(MCQ_TIMESTAMP_KEY);
    setMcqs([]);
    setMcqsLastFetch(null);
    console.log("🗑️ MCQ cache cleared");
  };
  const hexToString = (hex) => {
    if (!hex || typeof hex !== 'string') return hex;
    
    try {
      // Remove spaces and convert hex pairs to characters
      const cleanHex = hex.replace(/\s+/g, '');
      let result = '';
      
      for (let i = 0; i < cleanHex.length; i += 2) {
        const hexPair = cleanHex.substr(i, 2);
        const charCode = parseInt(hexPair, 16);
        if (!isNaN(charCode)) {
          result += String.fromCharCode(charCode);
        }
      }
      
      return result;
    } catch (err) {
      console.warn("Failed to convert hex to string:", hex);
      return hex; // Return original if conversion fails
    }
  };

  // 🔄 Function to process MCQ data and convert hex fields to strings
  const processMcqData = (mcqData) => {
    return mcqData.map(mcq => ({
      ...mcq,
      question: hexToString(mcq.question),
      option1: hexToString(mcq.option1),
      option2: hexToString(mcq.option2),
      option3: hexToString(mcq.option3),
      option4: hexToString(mcq.option4),
      Solution: hexToString(mcq.Solution),
      solution: hexToString(mcq.solution)
    }));
  };

  // 🧠 Fetch function for problems
  const fetchAllProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://vaibhav-e5q6islzdq-uc.a.run.app/getallproblems");
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setProblems(data.data);
        setError("");
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

  // 🧠 Fetch function for MCQs with caching
  const fetchAllMcqs = async (forceRefresh = false) => {
    try {
      setMcqLoading(true);
      setMcqError("");

      // Check cache first (unless force refresh)
      if (!forceRefresh && isMcqCacheValid()) {
        const loaded = loadMcqsFromCache();
        if (loaded) {
          setMcqLoading(false);
          return; // Use cached data
        }
      }

      console.log("🌐 Fetching MCQs from server...");
      const res = await fetch("https://api-e5q6islzdq-uc.a.run.app/getallmcqs");
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        // Process MCQ data to convert hex to strings
        const processedMcqs = processMcqData(data.data);
        setMcqs(processedMcqs);
        
        // Save to cache
        saveMcqsToCache(processedMcqs);
        
        setMcqError("");
      } else {
        setMcqError("Invalid MCQ data received from API");
      }
    } catch (err) {
      console.error("❌ Error fetching MCQs:", err);
      setMcqError("Failed to fetch MCQs");
    } finally {
      setMcqLoading(false);
    }
  };

  // 🔁 Load MCQs on mount
  useEffect(() => {
    fetchAllProblems();
    
    // Try to load MCQs from cache first
    const loaded = loadMcqsFromCache();
    if (!loaded || !isMcqCacheValid()) {
      // Cache miss or expired - fetch from server
      fetchAllMcqs();
    }
  }, []);

  const contextValue = {
    // Problems
    problems,
    loading,
    error,
    refetchProblems: fetchAllProblems,
    
    // MCQs
    mcqs,
    mcqLoading,
    mcqError,
    fetchAllMcqs,
    refetchMcqs: () => fetchAllMcqs(true), // Force refresh
    clearMcqCache,
    mcqsLastFetch,
    isMcqCacheValid: isMcqCacheValid()
  };

  return (
    <ProblemContext.Provider value={contextValue}>
      {children}
    </ProblemContext.Provider>
  );
};