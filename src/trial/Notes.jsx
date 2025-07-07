import React, { useEffect, useState } from "react";
import { useNotes } from "../context/NotesProvider";
import { useUser } from "../context/UserProvider";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing HTML

export default function Notes() {
  const { subject, units, note, fetchSubjects, fetchUnits, fetchNote } = useNotes();
  const { theme } = useUser();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const loadSubjects = async () => {
      const fetched = await fetchSubjects();
      setSubjects(fetched);
    };
    loadSubjects();
  }, [fetchSubjects]);

  // Sanitize the note content to remove problematic styles/scripts
  const sanitizedContent = note ? DOMPurify.sanitize(note.content, {
    // Allow only safe tags and attributes
    ALLOWED_TAGS: ['p', 'div', 'span', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'a', 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class'],
    // Remove inline styles to prevent layout issues
    FORBID_ATTR: ['style']
  }) : "";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: theme === "light" ? "#f5f7fa" : "#121212",
        color: theme === "light" ? "#333" : "#eee",
        overflow: "auto", // Prevent clipping
        boxSizing: "border-box",
        contain: "layout" // Isolate layout changes
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          background: theme === "light" ? "#ffffff" : "#1e1e1e",
          padding: "1rem",
          borderRight: "1px solid #ddd",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          minWidth: "280px" // Prevent shrinking
        }}
        className="text-left"
      >
        <select
          onChange={(e) => fetchUnits(e.target.value)}
          value={subject}
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
            fontSize: "0.95rem"
          }}
        >
          <option value="">-- Select Subject --</option>
          {subjects.map((subj, idx) => (
            <option key={idx} value={subj}>
              {subj}
            </option>
          ))}
        </select>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "4px"
          }}
        >
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {units.map((unit, idx) => (
              <li
                key={idx}
                onClick={() => {
                  console.log("Fetching note for:", unit.heading); // Debug
                  fetchNote(unit.heading);
                }}
                style={{
                  padding: "0.6rem 0.8rem",
                  marginBottom: "0.4rem",
                  cursor: "pointer",
                  backgroundColor: theme === "light" ? "#f9f9f9" : "#2a2a2a",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  transition: "all 0.2s ease-in-out"
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    theme === "light" ? "#e8f0fe" : "#333")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    theme === "light" ? "#f9f9f9" : "#2a2a2a")
                }
              >
                {unit.heading}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          minWidth: 0, // Prevent shrinking
           
          overflowY: "auto",
          background: theme === "light" ? "#f5f7fa" : "#1a1a1a",
          contain: "layout" // Isolate layout changes
        }}
        className="text-left"
      >
        {note ? (
          <>
            {/* HTML Content */}
            <div
              style={{
                lineHeight: "1.7",
                fontSize: "1rem",
                backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
                padding: "1.5rem",
                borderRadius: "10px",
                boxShadow: "0 0 8px rgba(0,0,0,0.05)",
                textAlign: "left",
                overflow: "auto",
                maxWidth: "100%",
                maxHeight: "100%", // Constrain height
                boxSizing: "border-box",
                contain: "layout style", // Strictly isolate styles and layout
                isolation: "isolate" // Prevent style leakage
              }}
            >
              {/* Use sanitized content */}
              <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>

            {/* Code Block */}
            {note.code && (
              <div
                style={{
                  backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
                  color: theme === "light" ? "#333333" : "#c3f3c8",
                  padding: "1rem 1.5rem",
                  marginTop: "1.5rem",
                  borderRadius: "10px",
                  overflowX: "auto",
                  fontSize: "0.95rem",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  border: theme === "light" ? "1px solid #ccc" : "1px solid #444",
                  textAlign: "left"
                }}
              >
                <code
                  style={{
                    backgroundColor: "transparent",
                    fontFamily: "monospace",
                    display: "block",
                    lineHeight: "1.6",
                    color: theme === "light" ? "#333" : "#c3f3c8"
                  }}
                >
                  {note.code}
                </code>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              fontSize: "1rem",
              color: "#777",
              textAlign: "center",
              marginTop: "5rem"
            }}
          >
            👈 Select a unit to view the notes
          </div>
        )}
      </div>
    </div>
  );
}