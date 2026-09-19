import React from "react";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full items-end gap-2.5 my-2.5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Bot Avatar (aligned left) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0c1f15] to-[#050505] border border-[#00E676]/20 flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.05)] flex-shrink-0">
          <Bot className="w-4.5 h-4.5 text-[#00E676]" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[75%] px-4 py-2.5 text-sm font-normal leading-relaxed break-words shadow-sm transition-all duration-200 ${
          isUser
            ? "bg-[#00E676] text-black rounded-2xl rounded-br-none font-medium"
            : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-2xl rounded-bl-none"
        }`}
      >
        <span className="whitespace-pre-wrap">{content}</span>
      </div>

      {/* User Avatar (aligned right) */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center flex-shrink-0">
          <User className="w-4.5 h-4.5 text-neutral-400" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
