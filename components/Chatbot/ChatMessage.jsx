import ChatBotIcon from "./ChatBotIcon";
import styles from "./Chatbot.module.css";

const ChatMessage = ({ chat }) => {
  if (chat.hideInChat) return null;
  const roleClass =
    chat.role === "model" ? styles.botMessage : styles.userMessage;
  const errorClass = chat.isError ? styles.error : "";
  return (
    <div
      className={[styles.message, roleClass, errorClass]
        .filter(Boolean)
        .join(" ")}
    >
      {chat.role === "model" && <ChatBotIcon />}
      <p className={styles.messageText}>{chat.text}</p>
    </div>
  );
};

export default ChatMessage;
