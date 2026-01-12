import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNotes } from "../hooks/useNotes";
import {
  StickyNote,
  Send,
  X,
  Copy,
  Scissors,
  ClipboardPaste,
  Code,
  Shield,
  UserCheck,
  Palette,
  Scissors as ScissorsIcon,
} from "lucide-react";
import {
  getCurrentUserRole,
  generateChangeNote,
  getElementDisplayName,
  analyzeElement,
} from "../lib/elementAnalysis";

/**
 * Enhanced right-click context menu with role-based functionality
 * Provides comprehensive element analysis and change guidance
 */
export const NoteContextMenu: React.FC = () => {
  const { addNote } = useNotes();
  const [menu, setMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    targetElement: HTMLElement | null;
    elementInfo: string;
  }>({ visible: false, x: 0, y: 0, targetElement: null, elementInfo: "" });

  const [inputMode, setInputMode] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [enhancedNote, setEnhancedNote] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const userRole = getCurrentUserRole();

  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Don't override our own menu
    if (target.closest("[data-note-menu]")) return;

    // Allow normal browser behavior for text inputs and editable content
    const isEditable =
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable ||
      target.closest('input, textarea, [contenteditable="true"]');

    // Only show custom menu for interactive elements, not text areas
    const isInteractive =
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button, a, .clickable, [data-interactive]") ||
      !isEditable;

    if (!isInteractive) {
      return; // Let browser handle it normally
    }

    e.preventDefault();

    // Analyze the element
    const analysis = analyzeElement(target);
    const displayName = getElementDisplayName(target);

    setMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetElement: target,
      elementInfo: displayName,
    });
    setInputMode(false);
    setNoteText("");
    setEnhancedNote("");
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("[data-note-menu]")) {
      setMenu((prev) => ({ ...prev, visible: false }));
      setInputMode(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleContextMenu, handleClickOutside]);

  useEffect(() => {
    if (inputMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputMode]);

  const handleAddNoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Generate enhanced note when entering input mode
    if (menu.targetElement) {
      const fullNote = generateChangeNote(menu.targetElement);
      setEnhancedNote(fullNote);
    }

    setInputMode(true);
  };

  const handleSend = () => {
    if (noteText.trim()) {
      const finalNote = enhancedNote
        ? `${enhancedNote}\n\n[USER INPUT]\n${noteText.trim()}`
        : `[${userRole}] ${noteText.trim()}`;

      addNote(finalNote);
      setMenu((prev) => ({ ...prev, visible: false }));
      setInputMode(false);
      setNoteText("");
      setEnhancedNote("");
    }
  };

  const handleClose = () => {
    setMenu((prev) => ({ ...prev, visible: false }));
    setInputMode(false);
    setNoteText("");
    setEnhancedNote("");
  };

  const handleCopy = () => {
    const selection = window.getSelection();
    const text = selection?.toString() || menu.elementInfo;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied:", text);
      })
      .catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      });

    setMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleCut = () => {
    const selection = window.getSelection();
    const text = selection?.toString() || "";

    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          const activeEl = document.activeElement as HTMLElement;
          if (
            activeEl &&
            (activeEl.tagName === "INPUT" ||
              activeEl.tagName === "TEXTAREA" ||
              activeEl.isContentEditable)
          ) {
            document.execCommand("delete");
          }
        })
        .catch(() => {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        });
    }

    setMenu((prev) => ({ ...prev, visible: false }));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();

      const activeEl = document.activeElement as
        | HTMLInputElement
        | HTMLTextAreaElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
      ) {
        const start = activeEl.selectionStart || 0;
        const end = activeEl.selectionEnd || 0;
        const value = activeEl.value;
        activeEl.value = value.slice(0, start) + text + value.slice(end);
        activeEl.selectionStart = activeEl.selectionEnd = start + text.length;
        activeEl.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        document.execCommand("insertText", false, text);
      }
    } catch (e) {
      console.log("Paste requires clipboard permission");
    }
    setMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleInspect = () => {
    if (menu.targetElement) {
      const analysis = analyzeElement(menu.targetElement);
      console.log(
        "%c🔍 Enhanced Element Analysis:",
        "color: blue; font-weight: bold;",
      );
      console.log("Basic Info:", menu.elementInfo);
      console.log("Full Analysis:", analysis);
      console.log(
        "Change Note:",
        enhancedNote || 'Generate with "Add Change Note"',
      );
      console.log("Tip: Press F12 to open DevTools, then click Elements tab");

      const toast = document.createElement("div");
      toast.innerHTML = "🔍 Element analysis logged to console (F12 → Console)";
      toast.style.cssText =
        "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:12px 20px;border-radius:8px;z-index:999999;font-size:14px;";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    setMenu((prev) => ({ ...prev, visible: false }));
  };

  // Role-specific actions
  const handleRoleAction = () => {
    if (!menu.targetElement) return;

    const analysis = analyzeElement(menu.targetElement);

    switch (userRole) {
      case "ADMIN":
        console.log("🔧 Admin Action:", analysis);
        alert(
          `Admin Action for ${analysis.tagName}: ${analysis.suggestedChange}`,
        );
        break;
      case "DESIGNER":
        console.log("🎨 Designer Action:", analysis);
        addNote(
          `[DESIGNER] ${analysis.suggestedChange}\nLocation: ${analysis.location}\nElement: ${analysis.elementPath}`,
        );
        break;
      case "SEAMSTRESS":
        console.log("✂️ Seamstress Action:", analysis);
        addNote(
          `[SEAMSTRESS] ${analysis.suggestedChange}\nElement: ${analysis.elementPath}`,
        );
        break;
      case "CUSTOMER":
        console.log("🛒 Customer Request:", analysis);
        addNote(
          `[CUSTOMER REQUEST] ${analysis.suggestedChange}\nFor element: ${menu.elementInfo}`,
        );
        break;
    }

    setMenu((prev) => ({ ...prev, visible: false }));
  };

  if (!menu.visible) return null;

  // Keep menu in viewport
  const left = Math.min(menu.x, window.innerWidth - 300);
  const top = Math.min(menu.y, window.innerHeight - 300);
  const hasSelection = !!window.getSelection()?.toString();

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "border-red-500 bg-red-50";
      case "DESIGNER":
        return "border-purple-500 bg-purple-50";
      case "SEAMSTRESS":
        return "border-green-500 bg-green-50";
      case "CUSTOMER":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-4 w-4 text-red-600" />;
      case "DESIGNER":
        return <Palette className="h-4 w-4 text-purple-600" />;
      case "SEAMSTRESS":
        return <ScissorsIcon className="h-4 w-4 text-green-600" />;
      case "CUSTOMER":
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      default:
        return <UserCheck className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div
      data-note-menu
      className={`fixed z-[99999] bg-white border-2 rounded-lg shadow-2xl overflow-hidden ${getRoleColor(userRole)}`}
      style={{ left, top, minWidth: 280, maxWidth: 320 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Role Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {getRoleIcon(userRole)}
          <span className="font-medium text-gray-900">{userRole} Menu</span>
        </div>
        <div className="text-xs text-gray-500 mt-1 truncate">
          📍 {menu.elementInfo}
        </div>
      </div>

      {!inputMode ? (
        <div>
          {/* Standard Actions */}
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <Copy className="h-4 w-4 text-gray-500" />
            <span>Copy</span>
            <span className="ml-auto text-xs text-gray-400">Ctrl+C</span>
          </button>

          {hasSelection && (
            <button
              onClick={handleCut}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
            >
              <Scissors className="h-4 w-4 text-gray-500" />
              <span>Cut</span>
              <span className="ml-auto text-xs text-gray-400">Ctrl+X</span>
            </button>
          )}

          <button
            onClick={handlePaste}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <ClipboardPaste className="h-4 w-4 text-gray-500" />
            <span>Paste</span>
            <span className="ml-auto text-xs text-gray-400">Ctrl+V</span>
          </button>

          <div className="border-t border-gray-200 my-1" />

          {/* Role-specific Action */}
          <button
            onClick={handleRoleAction}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            {getRoleIcon(userRole)}
            <span>{userRole} Action</span>
          </button>

          <div className="border-t border-gray-200 my-1" />

          {/* Inspect */}
          <button
            onClick={handleInspect}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <Code className="h-4 w-4 text-gray-500" />
            <span>Inspect</span>
            <span className="ml-auto text-xs text-gray-400">F12</span>
          </button>

          <div className="border-t border-gray-200 my-1" />

          {/* Add Change Note */}
          <button
            onClick={handleAddNoteClick}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-yellow-50 flex items-center gap-3 font-medium text-yellow-700"
          >
            <StickyNote className="h-4 w-4 text-yellow-600" />
            <span>Add Change Note</span>
          </button>
        </div>
      ) : (
        /* Input mode - enhanced change description */
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              📝 Add Change Note
            </span>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Enhanced Element Info */}
          {enhancedNote && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs font-medium text-blue-800 mb-2">
                Generated Context:
              </div>
              <pre className="text-xs text-blue-700 whitespace-pre-wrap font-mono">
                {enhancedNote.slice(0, 200)}
                {enhancedNote.length > 200 ? "..." : ""}
              </pre>
            </div>
          )}

          <textarea
            ref={inputRef}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
              if (e.key === "Escape") handleClose();
            }}
            placeholder="Describe the specific changes needed..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleClose}
              className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!noteText.trim()}
              className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteContextMenu;
