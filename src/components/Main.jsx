import styles from "../styles/Main.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const FIELDS = {
  USERNAME: "username",
  ROOM: "room",
};

const Main = () => {
  const { USERNAME, ROOM } = FIELDS;

  const [values, setValues] = useState({
    [USERNAME]: "",
    [ROOM]: "",
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = (e) => {
    if (!values[USERNAME] || !values[ROOM]) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.wrap}>
      <div className="container">
        <h1 className={styles.heading}>Join</h1>
        <form action="" className={styles.form}>
          <div className={styles.group}>
            <input
              type="text"
              name="username"
              value={values[USERNAME]}
              className={styles.input}
              placeholder="Username"
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.group}>
            <input
              type="text"
              name="room"
              value={values[ROOM]}
              className={styles.input}
              placeholder="Room"
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.group}>
            <Link
              to={`/chat?username=${values[USERNAME]}&room=${values[ROOM]}`}
              className={styles.button}
              onClick={handleClick}
            >
              <button type="submit">Sign In</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Main;
