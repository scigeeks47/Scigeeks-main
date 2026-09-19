import React from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
}) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-full flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 focus-within:border-[#00E676]/30 focus-within:ring-1 focus-within:ring-[#00E676]/30 transition-all duration-300 relative z-10"
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="Ask a Biology question..."
        className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none w-full disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 ${
          disabled || !value.trim()
            ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
            : "bg-[#00E676] text-black hover:bg-[#00C853] hover:scale-[1.02] active:scale-95 cursor-pointer"
        }`}
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};

export default ChatInput;
