import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { safeStorage } from "@/lib/storage";

export interface ChangeNote {
  id: number;
  text: string;
  createdAt: string;
  applied: boolean;
}

interface NotesContextType {
  notes: ChangeNote[];
  addNote: (text: string) => void;
  removeNote: (id: number) => void;
  applyNote: (id: number) => void;
  applyAllNotes: () => void;
  clearNotes: () => void;
  listNotes: () => ChangeNote[];
  getNote: (id: number) => ChangeNote | undefined;
  copyAllForAI: () => string;
}

const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<ChangeNote[]>(() => {
    if (typeof window !== "undefined") {
      return safeStorage.getChangeNotes();
    }
    return [];
  });

  // Persist to safe storage whenever notes change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const success = safeStorage.setChangeNotes(notes);
      if (!success) {
        console.warn(
          "Failed to save notes to storage, data will be lost on page refresh",
        );
      }
    }
  }, [notes]);

  const addNote = useCallback((text: string) => {
    setNotes((prev) => {
      const newId =
        prev.length > 0 ? Math.max(...prev.map((n) => n.id)) + 1 : 1;
      const newNote: ChangeNote = {
        id: newId,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        applied: false,
      };
      console.log(`📝 Note #${newId} added: "${text}"`);
      return [...prev, newNote];
    });
  }, []);

  const removeNote = useCallback((id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    console.log(`🗑️ Note #${id} removed`);
  }, []);

  const applyNote = useCallback((id: number) => {
    setNotes((prev) => {
      const note = prev.find((n) => n.id === id);
      if (note) {
        console.log(`✅ Note #${id} marked as applied: "${note.text}"`);
      }
      return prev.map((n) => (n.id === id ? { ...n, applied: true } : n));
    });
  }, []);

  const applyAllNotes = useCallback(() => {
    setNotes((prev) => {
      console.log(`✅ All ${prev.length} notes marked as applied`);
      return prev.map((n) => ({ ...n, applied: true }));
    });
  }, []);

  const clearNotes = useCallback(() => {
    setNotes([]);
    console.log("🧹 All notes cleared");
  }, []);

  const listNotes = useCallback(() => {
    console.log("📋 Current Notes:");
    if (notes.length === 0) {
      console.log("  (No notes)");
    } else {
      notes.forEach((note) => {
        const status = note.applied ? "✅" : "⏳";
        console.log(`  ${status} #${note.id}: ${note.text}`);
      });
    }
    return notes;
  }, [notes]);

  const getNote = useCallback(
    (id: number) => {
      return notes.find((n) => n.id === id);
    },
    [notes],
  );

  const copyAllForAI = useCallback(() => {
    const pendingNotes = notes.filter((n) => !n.applied);
    if (pendingNotes.length === 0) {
      return "No pending notes.";
    }
    const text = `Apply these change notes:\n\n${pendingNotes.map((n) => `#${n.id}: ${n.text}`).join("\n")}`;
    try {
      navigator.clipboard.writeText(text);
    } catch (error) {
      console.warn("Failed to copy to clipboard:", error);
    }
    return text;
  }, [notes]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        removeNote,
        applyNote,
        applyAllNotes,
        clearNotes,
        listNotes,
        getNote,
        copyAllForAI,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
