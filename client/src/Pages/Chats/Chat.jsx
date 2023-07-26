import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./chat.css";
import { useNavigate } from "react-router";
import Footer from "../../Components/Footer";
import { toast } from "react-hot-toast";
import Card from "react-bootstrap/Card";
import Loading from "../../Components/Loading";

function Chat() {
  const navigate = useNavigate();
  const themeButtonRef = useRef(null);
  const [trigger, setTrigger] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [userText, setUserText] = useState("");
  const [reply, setReply] = useState([]);
  const [msg, setMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = window.localStorage.getItem("userID");
  const storedTheme = window.localStorage.getItem("themeColor");

  useEffect(() => {
    document.body.classList.toggle("light-mode", storedTheme === "light_mode");
    setToggle(storedTheme === "light_mode");
  }, [storedTheme]);

  const key = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      setLoading(true);
      await axios.post("https://converseai-server.onrender.com/post", {
        userId: userId,
        msg: userText,
      });
      setTrigger(!trigger);
      setUserText("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `https://converseai-server.onrender.com/post/${userId}`
        );
        if (res.data.length !== 0) {
          setMsg(res.data[0].message);
          setReply(res.data[0].reply);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [trigger]);

  const handleToggleTheme = () => {
    document.body.classList.toggle("light-mode");
    const currentTheme = document.body.classList.contains("light-mode")
      ? "light_mode"
      : "dark_mode";
    localStorage.setItem("themeColor", currentTheme);
    setToggle(!toggle); // Update the toggle state
  };

  const handleDeleteChats = async () => {
    if (window.confirm("Are you sure you want to delete all the chats?")) {
      setMsg([]);
      setReply([]);
      try {
        await axios.delete(
          `https://converseai-server.onrender.com/post/${userId}`
        );
        toast.success("Deleted", {
          style: {
            fontSize: "15px",
          },
        });
      } catch (error) {
        console.error(error);
        toast.error("Nothing to delete", {
          style: {
            fontSize: "15px",
          },
        });
      }
    }
  };

  const handleclick = () => {
    window.localStorage.removeItem("userID");
    navigate("/");
    toast.success("Logged out!", {
      style: {
        fontSize: "15px",
      },
    });
  };

  return (
    <>
      <div className="typing-container">
        <div className="typing-content">
          <div className="typing-textarea">
            <button
              onClick={handleclick}
              className="btnn"
              style={{ width: "60px", marginRight: "8px" }}
            >
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
            <textarea
              id="chat-input"
              spellCheck="false"
              placeholder="Enter a prompt here"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              onKeyDown={key}
              required
            ></textarea>
            <span
              id="send-btn"
              className="material-symbols-rounded"
              onClick={handleSubmit}
            >
              {loading ? <Loading /> : <i class="fa-solid fa-paper-plane"></i>}
            </span>
          </div>
          <div className="typing-controls">
            <span
              id="theme-btn"
              className="material-symbols-rounded"
              onClick={handleToggleTheme}
              ref={themeButtonRef}
            >
              {toggle ? (
                <i class="fa-solid fa-moon"></i>
              ) : (
                <i class="fa-solid fa-sun"></i>
              )}
            </span>
            <span
              id="delete-btn"
              className="material-symbols-rounded"
              onClick={handleDeleteChats}
            >
              <i class="fa-solid fa-trash-can"></i>
            </span>
          </div>
        </div>
        <Footer />
      </div>
      {msg.length === 0 ? (
        <div className="nadu">
          <div className="per">
            <h1 className="h11">
              Converse-<span className="span">AI</span>
            </h1>
          </div>
          <div className="keel">
            <h3
              className="h3"
              style={{
                textAlign: "center",
                marginBottom: "15px",
                fontSize: "2rem",
              }}
            >
              Examples
            </h3>
            <Card
              style={{
                width: "17rem",
                marginBottom: "15px",
                fontSize: "0.98rem",
                background: "transparent",
                cursor: "pointer",
                color: "white",
              }}
              onClick={() =>
                setUserText("Tell me about MKCE in Karur in two lines?")
              }
            >
              <Card.Body>
                <Card.Text className="cardi">
                  "Tell me about MKCE in Karur in two lines?" →
                </Card.Text>
              </Card.Body>
            </Card>
            <Card
              style={{
                width: "17rem",
                marginBottom: "15px",
                fontSize: "0.98rem",
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={() =>
                setUserText("Got any ideas for business development?")
              }
            >
              <Card.Body>
                <Card.Text className="cardi">
                  "Got any ideas for business development?" →
                </Card.Text>
              </Card.Body>
            </Card>
            <Card
              style={{
                width: "17rem",
                marginBottom: "15px",
                fontSize: "0.98rem",
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={() => setUserText("How to get out of the MATRIX?")}
            >
              <Card.Body>
                <Card.Text className="cardi">
                  "How to get out of the MATRIX?" →
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      ) : (
        <div className="chat-container">
          {msg.map((message, index) => (
            <div key={index}>
              <div className="chat-content">
                <div className="chat-details right">
                  <p>{message}</p>
                </div>
              </div>
              <div className="chat-content">
                <div className="chat-details left">
                  <p>{reply[index]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Chat;
