import React from "react";
import "./login.css";
import "../Chats/chat.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Auth() {
  const [click, setClick] = React.useState(false);
  const userId = window.localStorage.getItem("userID");

  React.useEffect(() => {
    if (userId) {
      window.localStorage.removeItem("userID");
    }
  });
  return (
    <>
      <main>
        <div className="container">
          <input type="checkbox" id="check" />
          <Login click={click} setClick={setClick} />
          <Register click={click} setClick={setClick} />
          <div className="signup">
            <span className="signup">
              {!click ? "Don't have an account? " : "Already have an account? "}
              <label htmlFor="check" onClick={() => setClick(!click)}>
                {!click ? "Register" : "Login"}
              </label>
            </span>
          </div>
        </div>
      </main>
    </>
  );
}

export default Auth;

function Login({ click, setClick }) {
  const [uname, setUname] = React.useState("");
  const [pass, setPass] = React.useState("");
  const navigate = useNavigate();

  const load = (isLoading) => {
    if (isLoading) {
      return toast.loading("Checking...", {
        style: {
          fontSize: "15px",
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lt = load(true);
    try {
      const res = await axios.post(
        "https://converseai-server.onrender.com/auth/login",
        {
          username: uname,
          password: pass,
        }
      );
      window.localStorage.setItem("userID", res.data.userID);
      toast.dismiss(lt);
      toast.success("Welcome Back!", {
        style: {
          fontSize: "15px",
        },
      });
      navigate("/home");
    } catch (error) {
      console.log(error);
      toast.dismiss(lt);
      toast.error("Username or Password is incorecct!", {
        style: {
          fontSize: "15px",
        },
      });
    }
  };

  return (
    <div className="lo">
      <div></div>
      {!click && (
        <div className="login form">
          <h1 className="h1">
            Converse-<span className="span">AI</span>
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your username"
              required={true}
              value={uname}
              onChange={(e) => setUname(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              required={true}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <input type="submit" className="button" value="Login" />
          </form>
        </div>
      )}
    </div>
  );
}

function Register({ click, setClick }) {
  const [uname, setUname] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [cpass, setCpass] = React.useState("");
  const [error, setError] = React.useState(0);

  const load = (isLoading) => {
    if (isLoading) {
      return toast.loading("Checking...", {
        style: {
          fontSize: "15px",
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error === 0) {
      const lt = load(true);
      try {
        await axios.post(
          "https://converseai-server.onrender.com/auth/register",
          {
            username: uname,
            password: pass,
          }
        );
        toast.dismiss(lt);
        toast.success("Registered!", {
          style: {
            fontSize: "15px",
          },
        });
        setUname("");
        setPass("");
        setCpass("");
        setClick(false);
      } catch (error) {
        console.log(error);
        toast.dismiss(lt);
        toast.error("Username already exists!", {
          style: {
            fontSize: "15px",
          },
        });
      }
    }
  };

  React.useEffect(() => {
    if (!(pass === cpass)) {
      setError(1);
    } else if (pass === "" && cpass === "") {
      setError(0);
    } else if (pass === cpass) {
      const decimal =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,10}$/;
      if (cpass.match(decimal)) {
        setError(0);
      } else {
        setError(-1);
      }
    }
  }, [cpass, pass]);
  return (
    <div className="lo">
      {click && (
        <div className="login form">
          <h1 className="h1">
            Converse-<span className="span">AI</span>
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your username"
              required={true}
              value={uname}
              onChange={(e) => setUname(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              required={true}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            {error === 1 && (
              <span className="error">Passwords do not match</span>
            )}
            <input
              type="password"
              placeholder="Confirm password"
              required={true}
              value={cpass}
              onChange={(e) => setCpass(e.target.value)}
            />
            {error === -1 && (
              <span className="li error">
                <ul>
                  <li>Length: 8-10 characters</li>
                  <li>At least 1 uppercase letter </li>
                  <li>At least 1 lowercase letter </li>
                  <li>At least 1 special character </li>
                  <li>At least 1 number</li>
                </ul>
              </span>
            )}
            <input type="submit" className="button" value="Register" />
          </form>
        </div>
      )}
    </div>
  );
}
