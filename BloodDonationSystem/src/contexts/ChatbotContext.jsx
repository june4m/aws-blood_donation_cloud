// Context để quản lý trạng thái chatbot
import { createContext, useContext, useState } from "react";

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <ChatbotContext.Provider value={{ isChatbotOpen, setIsChatbotOpen }}>
      {children}
    </ChatbotContext.Provider>
  );
};
