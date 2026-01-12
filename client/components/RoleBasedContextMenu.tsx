import React, { useState, useEffect, useRef } from "react";
import { useNotes } from "../hooks/useNotes";
import {
  StickyNote,
  Send,
  X,
  Copy,
  Users,
  Trash2,
  DollarSign,
  Palette,
  Settings,
  Shield,
  Eye,
  Edit,
  CheckCircle,
  UserCheck,
  Scissors as ScissorsIcon,
} from "lucide-react";

interface RoleBasedContextMenuProps {
  elementInfo: string;
  targetElement?: HTMLElement;
  onClose: () => void;
}

export const RoleBasedContextMenu: React.FC<RoleBasedContextMenuProps> = ({
  elementInfo,
  targetElement,
  onClose,
}) => {
  const { addNote } = useNotes();
  const [inputMode, setInputMode] = useState(false);
  const [noteText, setNoteText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Dynamic role detection from localStorage (like other components)
  const getUserRole = (): string => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.role || "CUSTOMER";
    } catch {
      return "CUSTOMER";
    }
  };

  const userRole = getUserRole();

  useEffect(() => {
    if (inputMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputMode]);

  const handleAddNoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputMode(true);
  };

  const handleSend = () => {
    if (noteText.trim()) {
      const finalNote = `[${userRole}] ${noteText.trim()}`;
      addNote(finalNote);
      setInputMode(false);
      setNoteText("");
      onClose();
    }
  };

  const handleCopy = () => {
    const selection = window.getSelection();
    const text = selection?.toString() || elementInfo;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied:", text);
      })
      .catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      });

    onClose();
  };

  const renderAdminOptions = () => (
    <>
      <div className="border-t border-gray-200 my-1" />
      <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
        🔧 Admin Actions
      </div>
      <button
        onClick={() => {
          console.log("Manage Users");
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-3 text-blue-700"
      >
        <Settings className="h-4 w-4 text-blue-600" />
        <span>Manage Users</span>
      </button>
      <button
        onClick={() => {
          console.log("Delete Account");
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-700"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
        <span>Delete Account</span>
      </button>
    </>
  );

  const renderCustomerOptions = () => (
    <>
      <div className="border-t border-gray-200 my-1" />
      <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
        🛒 Customer Actions
      </div>
      <button
        onClick={() => {
          console.log("Save to Favorites:", elementInfo);
          addNote(`[Favorites] Saved: ${elementInfo}`);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-pink-50 flex items-center gap-3 text-pink-700"
      >
        <StickyNote className="h-4 w-4 text-pink-600" />
        <span>Save to Favorites</span>
      </button>
      <button
        onClick={() => {
          console.log("Get Notified:", elementInfo);
          addNote(`[Notifications] Alert me about: ${elementInfo}`);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-pink-50 flex items-center gap-3 text-pink-700"
      >
        <Eye className="h-4 w-4 text-pink-600" />
        <span>Get Notified</span>
      </button>
    </>
  );

  const renderDesignerOptions = () => (
    <>
      <div className="border-t border-gray-200 my-1" />
      <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
        🎨 Designer Actions
      </div>
      <button
        onClick={() => {
          console.log("Edit Design:", elementInfo);
          addNote(`[Design] Edit design: ${elementInfo}`);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-3 text-purple-700"
      >
        <Edit className="h-4 w-4 text-purple-600" />
        <span>Edit Design</span>
      </button>
      <button
        onClick={() => {
          console.log("Duplicate Design:", elementInfo);
          addNote(`[Design] Duplicate: ${elementInfo}`);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-3 text-purple-700"
      >
        <Copy className="h-4 w-4 text-purple-600" />
        <span>Duplicate Design</span>
      </button>
    </>
  );

  const renderSeamstressOptions = () => (
    <>
      <div className="border-t border-gray-200 my-1" />
      <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
        ✂️ Seamstress Actions
      </div>
      <button
        onClick={() => {
          console.log("Accept Order:", elementInfo);
          addNote(`[Order] Accept order: ${elementInfo}`);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-green-50 flex items-center gap-3 text-green-700"
      >
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span>Accept Order</span>
      </button>
      <button
        onClick={() => {
          console.log("Set Pricing:", elementInfo);
          addNote(`[Pricing] Set price for: ${elementInfo}`);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-green-50 flex items-center gap-3 text-green-700"
      >
        <DollarSign className="h-4 w-4 text-green-600" />
        <span>Set Pricing</span>
      </button>
    </>
  );

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
      className={`fixed z-[99999] bg-white border-2 rounded-lg shadow-2xl overflow-hidden ${getRoleColor(userRole)}`}
      style={{ left: 100, top: 100, minWidth: 280, maxWidth: 320 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Role Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {getRoleIcon(userRole)}
          <span className="font-medium text-gray-900">{userRole} Menu</span>
        </div>
        <div className="text-xs text-gray-500 mt-1 truncate">
          📍 {elementInfo}
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
          </button>

          {/* Role-specific options */}
          {userRole === "ADMIN" && renderAdminOptions()}
          {userRole === "CUSTOMER" && renderCustomerOptions()}
          {userRole === "DESIGNER" && renderDesignerOptions()}
          {userRole === "SEAMSTRESS" && renderSeamstressOptions()}

          <div className="border-t border-gray-200 my-1" />

          {/* Universal Actions */}
          <button
            onClick={handleAddNoteClick}
            className="w-full px-4 py-2.5 text-left text-sm hover:bg-yellow-50 flex items-center gap-3 font-medium text-yellow-700"
          >
            <StickyNote className="h-4 w-4 text-yellow-600" />
            <span>Add Change Note</span>
          </button>
        </div>
      ) : (
        /* Input mode */
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              📝 Add Change Note
            </span>
            <button
              onClick={() => {
                setInputMode(false);
                setNoteText("");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <textarea
            ref={inputRef}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
              if (e.key === "Escape") {
                setInputMode(false);
                setNoteText("");
              }
            }}
            placeholder="Describe the specific changes needed..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                setInputMode(false);
                setNoteText("");
              }}
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
