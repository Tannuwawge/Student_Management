import { createContext, useContext, useState } from "react";

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const [subject, setSubject] = useState("");
  const [units, setUnits] = useState([]);
  const [note, setNote] = useState(null);

  const BASE_URL = "https://api-e5q6islzdq-uc.a.run.app/api";

  // 🔁 Convert hex to readable string
  const hexToString = (hex) => {
    try {
      return hex
        .match(/.{1,2}/g)
        .map((byte) => String.fromCharCode(parseInt(byte, 16)))
        .join("");
    } catch (err) {
      console.error("❌ Failed to decode hex:", hex);
      return hex; // fallback to raw hex
    }
  };

  // 🔄 Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${BASE_URL}/subjects`);
      const data = await res.json();
      const subjects = data.subjects || [];

      console.log("📚 Subjects fetched:", subjects);
      return subjects;
    } catch (err) {
      console.error("❌ Error fetching subjects:", err);
      return [];
    }
  };

  // 📂 Fetch units for a selected subject
  const fetchUnits = async (subject) => {
    try {
      setSubject(subject);
      setNote(null); // Reset previous note
      const res = await fetch(`${BASE_URL}/units?subject=${subject}`);
      const data = await res.json();
      setUnits(data.units || []);
    } catch (err) {
      console.error("❌ Error fetching units:", err);
    }
  };

  // 📜 Fetch note content for a specific unit
  const fetchNote = async (unitHeading) => {
    try {
      const res = await fetch(
        `${BASE_URL}/notes?subject=${subject}&unit=${encodeURIComponent(
          unitHeading
        )}`
      );
      const data = await res.json();
      const rawNote = data.data || null;

      // 👨‍💻 Decode hex code before saving
      if (rawNote?.code) {
        rawNote.code = hexToString(rawNote.code);
      }

      setNote(rawNote);
    } catch (err) {
      console.error("❌ Error fetching note:", err);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        subject,
        units,
        note,
        fetchSubjects,
        fetchUnits,
        fetchNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
