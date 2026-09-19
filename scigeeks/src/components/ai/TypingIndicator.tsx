import React from "react";
import { Bot } from "lucide-react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full items-end gap-2.5 my-2.5 justify-start">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0c1f15] to-[#050505] border border-[#00E676]/20 flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.05)] flex-shrink-0">
        <Bot className="w-4.5 h-4.5 text-[#00E676]" />
      </div>

      {/* Thinking Bubble */}
      <div className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#00E676]/80 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-[#00E676]/80 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-[#00E676]/80 animate-bounce" />
      </div>
    </div>
  );
};

export default TypingIndicator;
