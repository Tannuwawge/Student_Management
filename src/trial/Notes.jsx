import React, { useEffect, useState } from "react";
import { useNotes } from "../context/NotesProvider";

export default function Notes() {
  const { subject, units, note, fetchSubjects, fetchUnits, fetchNote } =
    useNotes();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const loadSubjects = async () => {
      const fetched = await fetchSubjects();
      setSubjects(fetched);
    };
    loadSubjects();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f5f7fa",
        color: "#333"
      }}
    >
      {/* Sidebar */}
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          background: "#ffffff",
          padding: "1rem",
          borderRight: "1px solid #ddd",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column"
        }}
        className="text-left"
      >
        {/* Dropdown */}
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

        {/* Scrollable Units List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "4px" // little space for scrollbar
          }}
        >
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {units.map((unit, idx) => (
              <li
                key={idx}
                onClick={() => fetchNote(unit.heading)}
                style={{
                  padding: "0.6rem 0.8rem",
                  marginBottom: "0.4rem",
                  cursor: "pointer",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  transition: "all 0.2s ease-in-out"
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e8f0fe")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9f9f9")
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
          padding: "2rem",
          overflowY: "auto",
          background: "#f5f7fa"
        }}
        className="text-left"
      >
        {note ? (
          <>
            {/* HTML content */}
            <div style={{
                lineHeight: "1.7",
                fontSize: "1rem",
                backgroundColor: "#fff",
                padding: "1.5rem",
                borderRadius: "10px",
                boxShadow: "0 0 8px rgba(0,0,0,0.05)",
                textAlign: "left",
                overflow: "auto", // ✅ contain big content
                maxWidth: "100%", // ✅ stop content from overflowing right
                wordBreak: "break-word" // ✅ wrap long words
              }}
              dangerouslySetInnerHTML={{ __html: note.content }}
            />

            {/* Code block */}
            {note.code && (
              <div
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#c3f3c8",
                  padding: "1rem 1.5rem",
                  marginTop: "1.5rem",
                  borderRadius: "10px",
                  overflowX: "auto",
                  fontSize: "0.95rem",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  border: "1px solid #444",
                  textAlign: "left"
                }}
              >
                <code>{note.code}</code>
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
