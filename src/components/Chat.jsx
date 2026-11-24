import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";
import { useState } from "react";
import Messages from "./Messages";
import styles from "../styles/Chat.module.css";
import EmojiPicker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";

const socket = io.connect("https://online-chat-socket-server.onrender.com");

const Chat = () => {
  const navigate = useNavigate();

  const [state, setState] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [params] = useSearchParams();
  const room = params.get("room");
  const username = params.get("username");

  useEffect(() => {
    const join = () => socket.emit("join", { username, room });

    join();
    socket.io.on("reconnect", join);

    return () => {
      socket.io.off("reconnect", join);
    };
  }, [username, room]);

  useEffect(() => {
    const onMessage = ({ data }) => setState((prev) => [...prev, data]);
    const onRoomData = ({ data: { users } }) => setUsers(users.length);

    socket.on("message", onMessage);
    socket.on("roomData", onRoomData);

    return () => {
      socket.off("message", onMessage);
      socket.off("roomData", onRoomData);
    };
  }, []);

  const leftRoom = () => {
    socket.emit("leftRoom", {
      username: username,
      room: room,
    });

    navigate("/");
  };

  const handleEmojiClick = ({ emoji }) => {
    setMessage(`${message + emoji}`);
  };

  const handleChange = ({ target: { value } }) => {
    setMessage(value);
  };

  const handleSend = (e) => {
    e.preventDefault();

    if (!message) return;

    socket.emit("sendMessage", { message, username, room });

    setMessage("");
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.title}>{room}</h1>
        <h2 className={styles.users}>{users} users online</h2>

        <button onClick={leftRoom} className={styles.leave}>
          Leave the room
        </button>
      </div>
      <div className={styles.chat}>
        <Messages messages={state} name={username} />
      </div>
      <form className={styles.form} onSubmit={handleSend}>
        <input
          name="message"
          className={styles.input}
          type="text"
          placeholder="Type a message..."
          autoComplete="off"
          required
          value={message}
          onChange={handleChange}
        />
        <div
          className={styles.emoji}
          onClick={(e) => {
            if (e.target.closest(".EmojiPickerReact")) return;
            setShowEmojiPicker(!showEmojiPicker);
          }}
        >
          {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
        </div>
        <button className={styles.send} type="submit">
          Send a message
        </button>
      </form>
    </div>
  );
};

export default Chat;
