import { useEffect, useRef, useState } from "react";
import ChatBotIcon from "./components/ChatBotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./components/companyInfo";

const App = () => {
  const [chatHistory, setChatHistory] = useState([{
    hideInChat: true,
    role: "model",
    text: companyInfo,
  }]);
  const [showChatBot, setShowChatBot] = useState([false]);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {

    // Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), { role: "model", text, isError }]);
    }


    // Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ contents: history }),
    }

    try {

      // Make the API call to get bot's response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Something went wrong");

      // Clean and update chat history with the bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {

    // Auto scroll whenever chat history updates
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatBot(prev => !prev)} id="chat-bot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>


      <div className="chatbot-popup">

        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button onClick={() => setShowChatBot(prev => !prev)}className="material-symbols-rounded">keyboard_arrow_down</button>
        </div>

        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">

          <div className="message bot-message">
            <ChatBotIcon />
            <p className="message-text">
              Hello! How can I assist you today?
            </p>
          </div>

          {/* Show suggested questions only when chat history is minimal */}
          {chatHistory.filter(chat => !chat.hideInChat).length === 0 && (
            <div className="suggested-questions">
              <p className="suggestions-title">Here are some questions you can ask:</p>
              <div className="suggestions-list">
                <button 
                  className="suggestion-btn" 
                  onClick={() => {
                    const userMessage = { role: "user", text: "What services do you offer?" };
                    setChatHistory(prev => [...prev, userMessage, { role: "model", text: "Thinking..." }]);
                    generateBotResponse([...chatHistory, userMessage]);
                  }}
                >
                  What services do you offer?
                </button>
                <button 
                  className="suggestion-btn" 
                  onClick={() => {
                    const userMessage = { role: "user", text: "How can I contact you?" };
                    setChatHistory(prev => [...prev, userMessage, { role: "model", text: "Thinking..." }]);
                    generateBotResponse([...chatHistory, userMessage]);
                  }}
                >
                  How can I contact you?
                </button>
                <button 
                  className="suggestion-btn" 
                  onClick={() => {
                    const userMessage = { role: "user", text: "What are your business hours?" };
                    setChatHistory(prev => [...prev, userMessage, { role: "model", text: "Thinking..." }]);
                    generateBotResponse([...chatHistory, userMessage]);
                  }}
                >
                  What are your business hours?
                </button>
                <button 
                  className="suggestion-btn" 
                  onClick={() => {
                    const userMessage = { role: "user", text: "Tell me about your company" };
                    setChatHistory(prev => [...prev, userMessage, { role: "model", text: "Thinking..." }]);
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
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
}

export default App;
