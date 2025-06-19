import React, { useState, useEffect } from "react";
import { useProblems } from "../context/ProblemProvider";

const InterviewPrep = () => {
  const { problems, loading } = useProblems();
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProblems, setFilteredProblems] = useState([]);

  useEffect(() => {
    if (!loading) {
      const filtered = problems.filter((prob) => {
        const value =
          searchType === "name"
            ? prob.header
            : searchType === "subject"
            ? prob.subject
            : prob.file_context;
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredProblems(filtered);
    }
  }, [searchTerm, searchType, problems, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        🎯 Interview Prep Zone
      </h1>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 max-w-5xl mx-auto">
      <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search problems..."
          className="p-3 rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-2/4"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 rounded-lg border border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-1/4"
        >
          <option value="name">By Name</option>
          <option value="subject">By Subject</option>
          <option value="platform">By Platform</option>
        </select>

     
      </div>

      <div className="max-w-5xl mx-auto">
        <ul className="space-y-3">
          {filteredProblems.map((prob, index) => (
            <li
              key={prob.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-100 w-full"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500">
                  {index + 1}.
                </span>
                <h2 className="text-lg font-semibold text-blue-800">
                  {prob.header}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  {prob.file_context}
                </span>
                <a
                  href={prob.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Solve
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InterviewPrep;