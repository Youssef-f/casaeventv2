import { useEffect, useRef, useState } from "react";
import ChatBotIcon from "./ChatBotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { companyInfo } from "./companyInfo";
import styles from "./Chatbot.module.css";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo,
    },
  ]);
  const [showChatBot, setShowChatBot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    // Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    // Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      // Make the API call to get bot's response
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong");

      // Clean and update chat history with the bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className={styles.container}>
      {!showChatBot && (
        <button
          className={styles.toggler}
          onClick={() => setShowChatBot(true)}
          aria-label="Open chatbot"
        >
          <span className="material-symbols-rounded">mode_comment</span>
        </button>
      )}
      {showChatBot && (
        <div className={styles.popup}>
          {/* Chatbot Header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <ChatBotIcon />
              <span className={styles.logoText}>Chatbot</span>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setShowChatBot(false)}
              aria-label="Close chatbot"
            >
              <span className="material-symbols-rounded">close</span>
            </button>
          </div>

          {/* Chatbot Body */}
          <div ref={chatBodyRef} className={styles.body}>
            <div className={`${styles.message} ${styles.botMessage}`}>
              <ChatBotIcon />
              <p className={styles.messageText}>
                Hello! How can I assist you today?
              </p>
            </div>

            {/* Show suggested questions only when chat history is minimal */}
            {chatHistory.filter((chat) => !chat.hideInChat).length === 0 && (
              <div className={styles.suggestedQuestions}>
                <p className={styles.suggestionsTitle}>
                  Here are some questions you can ask:
                </p>
                <div className={styles.suggestionsList}>
                  <button
                    className={styles.suggestionBtn}
                    onClick={() => {
                      const userMessage = {
                        role: "user",
                        text: "What services do you offer?",
                      };
                      setChatHistory((prev) => [
                        ...prev,
                        userMessage,
                        { role: "model", text: "Thinking..." },
                      ]);
                      generateBotResponse([...chatHistory, userMessage]);
                    }}
                  >
                    What services do you offer?
                  </button>
                  <button
                    className={styles.suggestionBtn}
                    onClick={() => {
                      const userMessage = {
                        role: "user",
                        text: "How can I contact you?",
                      };
                      setChatHistory((prev) => [
                        ...prev,
                        userMessage,
                        { role: "model", text: "Thinking..." },
                      ]);
                      generateBotResponse([...chatHistory, userMessage]);
                    }}
                  >
                    How can I contact you?
                  </button>
                  <button
                    className={styles.suggestionBtn}
                    onClick={() => {
                      const userMessage = {
                        role: "user",
                        text: "What are your business hours?",
                      };
                      setChatHistory((prev) => [
                        ...prev,
                        userMessage,
                        { role: "model", text: "Thinking..." },
                      ]);
                      generateBotResponse([...chatHistory, userMessage]);
                    }}
                  >
                    What are your business hours?
                  </button>
                  <button
                    className={styles.suggestionBtn}
                    onClick={() => {
                      const userMessage = {
                        role: "user",
                        text: "Tell me about your company",
                      };
                      setChatHistory((prev) => [
                        ...prev,
                        userMessage,
                        { role: "model", text: "Thinking..." },
                      ]);
                      generateBotResponse([...chatHistory, userMessage]);
                    }}
                  >
                    Tell me about your company
                  </button>
                </div>
              </div>
            )}

            {/* Render the chat history dynamically */}
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          {/* Chatbot Footer */}
          <div className={styles.footer}>
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
