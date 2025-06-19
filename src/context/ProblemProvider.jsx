// src/context/ProblemProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";

// Create the context
const ProblemContext = createContext();

// Custom hook to use this context
export const useProblems = () => useContext(ProblemContext);

// Provider component
export const ProblemProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🧠 Fetch function
  const fetchAllProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://vaibhav-e5q6islzdq-uc.a.run.app/getallproblems");
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setProblems(data.data);
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

  // 🔁 Fetch on load
  useEffect(() => {
    fetchAllProblems();
  }, []);

  return (
    <ProblemContext.Provider value={{ problems, loading, error, refetchProblems: fetchAllProblems }}>
      {children}
    </ProblemContext.Provider>
  );
};
