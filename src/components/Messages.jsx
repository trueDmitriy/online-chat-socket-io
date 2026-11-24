import styles from "../styles/Chat.module.css";

const Messages = ({ messages, name }) => {
  return (
    <div className={styles.messages}>
      {messages.map(({ text, user }, index) => {
        const itsMe =
          user.name.trim().toLowerCase() === name.trim().toLowerCase();
        const messageClass = itsMe ? styles.myMessage : styles.otherMessage;

        return (
          <div className={messageClass} key={index}>
            <strong>{user.name}: </strong>
            <span>{text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
