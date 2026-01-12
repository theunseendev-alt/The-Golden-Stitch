import React, { useState } from "react";
import { useNotes, ChangeNote } from "../hooks/useNotes";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Trash2,
  Check,
  CheckCheck,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  Clipboard,
  Send,
} from "lucide-react";

export const NotesPanel: React.FC = () => {
  const {
    notes,
    addNote,
    removeNote,
    applyNote,
    applyAllNotes,
    clearNotes,
    copyAllForAI,
  } = useNotes();
  const [isOpen, setIsOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      addNote(newNoteText);
      setNewNoteText("");
    }
  };

  const handleCopyForAI = () => {
    const text = copyAllForAI();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Show what was copied
    if (text !== "No pending notes.") {
      alert(
        "Notes copied to clipboard!\n\nPaste them into the chat to send to AI:\n\n" +
          text,
      );
    } else {
      alert("No pending notes to copy.");
    }
  };

  const pendingCount = notes.filter((n) => !n.applied).length;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 shadow-lg"
        variant={pendingCount > 0 ? "default" : "outline"}
      >
        📝 Notes{" "}
        {pendingCount > 0 && (
          <Badge className="ml-2" variant="secondary">
            {pendingCount}
          </Badge>
        )}
        {isOpen ? (
          <ChevronDown className="ml-2 h-4 w-4" />
        ) : (
          <ChevronUp className="ml-2 h-4 w-4" />
        )}
      </Button>

      {/* Notes Panel */}
      {isOpen && (
        <Card className="w-80 max-h-[500px] overflow-hidden shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Change Notes ({notes.length})</span>
              <div className="flex gap-1">
                {notes.length > 0 && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={applyAllNotes}
                      title="Mark All Applied"
                    >
                      <CheckCheck className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={clearNotes}
                      title="Clear All"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Add New Note */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a change note..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                className="text-sm"
              />
              <Button size="sm" onClick={handleAddNote} title="Add Note">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Copy for AI Button */}
            {pendingCount > 0 && (
              <Button
                onClick={handleCopyForAI}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Clipboard className="h-4 w-4 mr-2" />
                {copied ? "✓ Copied!" : `Copy ${pendingCount} Notes for AI`}
              </Button>
            )}

            {/* Notes List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No notes yet. Right-click anywhere and select "Add Change
                  Note".
                </p>
              ) : (
                notes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onApply={() => applyNote(note.id)}
                    onRemove={() => removeNote(note.id)}
                  />
                ))
              )}
            </div>

            {/* Instructions */}
            {notes.length > 0 && (
              <div className="text-xs text-gray-500 border-t pt-2">
                💡 Click "Copy Notes for AI" then paste into chat to send me the
                changes.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface NoteItemProps {
  note: ChangeNote;
  onApply: () => void;
  onRemove: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onApply, onRemove }) => {
  const handleDragStart = (e: React.DragEvent) => {
    // Only allow drag if not starting from a button
    if ((e.target as HTMLElement).closest('button')) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', note.text);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent drag if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      e.preventDefault();
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onMouseDown={handleMouseDown}
      className={`flex items-start gap-2 p-2 rounded text-sm cursor-move ${note.applied ? "bg-green-50 dark:bg-green-950 opacity-60" : "bg-muted"}`}
    >
      <span className="font-mono text-xs text-muted-foreground shrink-0">
        #{note.id}
      </span>
      <span
        className={`flex-1 break-words ${note.applied ? "line-through text-muted-foreground" : ""}`}
      >
        {note.text}
      </span>
      <div className="flex gap-1 shrink-0">
        {!note.applied && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={onApply}
            title="Mark Applied"
          >
            <Check className="h-3 w-3 text-green-600" />
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={onRemove}
          title="Remove"
        >
          <X className="h-3 w-3 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default NotesPanel;
