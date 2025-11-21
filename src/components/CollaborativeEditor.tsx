"use client";

import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom } from "@/liveblocks.config"; 
import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { Loader2 } from "lucide-react";

// Define colors for other users' cursors
const CURSOR_COLORS = ["#DC2626", "#D97706", "#059669", "#2563EB", "#7C3AED"];

const LANGUAGES = [
  { id: "typescript", label: "TypeScript" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "json", label: "JSON" },
];

export default function CollaborativeEditor() {
  const room = useRoom();
  const [editor, setEditor] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [language, setLanguage] = useState("typescript");

  // Set up Liveblocks Yjs connection
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yText = yDoc.getText("monaco");
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  // Bind Monaco to Yjs
  useEffect(() => {
    if (!editor || !provider) return;

    const binding = new MonacoBinding(
      provider.getYDoc().getText("monaco"),
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    return () => {
      binding.destroy();
    };
  }, [editor, provider]);

  const handleOnMount = (editor: any) => {
    setEditor(editor);
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] relative">
      {/* Toolbar */}
      <div className="h-10 bg-[#1e1e1e] border-b border-gray-800 flex items-center px-4 gap-4 z-10">
        <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Language:</span>
            <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#2d2d2d] text-gray-200 text-xs rounded px-2 py-1 border border-gray-700 focus:outline-none focus:border-blue-500 hover:bg-[#363636] transition-colors"
            >
                {LANGUAGES.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.label}</option>
                ))}
            </select>
        </div>
        
        <div className="flex-1"></div>
        
        {!provider ? (
             <div className="flex items-center gap-2 text-yellow-500 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" /> Connecting...
             </div>
        ) : (
             <div className="flex items-center gap-2 text-green-500 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Live
             </div>
        )}
      </div>

      {/* Editor Container */}
      <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language} 
            defaultValue="// Start coding..."
            theme="vs-dark"
            onMount={handleOnMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              automaticLayout: true, // Keeps editor resized correctly
            }}
          />
      </div>
    </div>
  );
}