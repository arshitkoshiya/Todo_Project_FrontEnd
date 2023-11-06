import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Login() {
  const [userName, setUserName] = useState<any>();
  const [password, setPassword] = useState<any>();
  const [error, setError] = useState<any>({
    visible: false,
    message: "",
  });
  const LoginURL = "http://10.37.55.112:5000/login";

  const handleSubmit = async () => {
    if (userName && password != null) {
      await axios
        ?.post(LoginURL, {
          username: userName,
          password: password,
        })
        .then((response: any) => {
          if (response.data.result === "Success") {
            setError({ display: false, message: "" });
            const user = response.data.data.username.split("@");
            MySwal.fire({
              title: <strong>Greate</strong>,
              html: <i>Welcome Back {user[0]}</i>,
              icon: "success",
            }).then(() => {
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("data", response.data.data.userId);
              localStorage.setItem("userData", response.data.data.username);
              localStorage.setItem("color", response.data.data.color);
              window.location.href = "/Home";
              return;
            });
          } else if (response.data.result === "Too many attempts") {
            setError({ visible: true, message: response.data.error });
          } else {
            setError({
              visible: true,
              message: "Username and Password not match",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setError({ visible: true, message: "Username and Password Required" });
    }
  };

  return (
    <div className="mainLogin">
      <div className="loginContainer">
        <div className="Login">
          Welcome <br /> Back :)
        </div>

        <div className="inputs">
          <input
            type="text"
            className="text fa fa-user"
            onChange={(e: any) => setUserName(e?.target?.value)}
            placeholder="Enter Username"
          />

          <input
            type="password"
            className="password"
            placeholder="Enter Password"
            onChange={(e: any) => setPassword(e?.target?.value)}
          />
          <input
            type="button"
            value="Login"
            className="LoginBTN"
            onClick={handleSubmit}
          />
          <p
            className="error"
            style={{
              visibility: error.visible === false ? "hidden" : "visible",
            }}
          >
            {error.message}
          </p>
          <div>
            Don't have an Account?{" "}
            <a className="CreateAccount" href="/SignUp">
              {" "}
              Create Account
            </a>
          </div>
          <div>
            Not Remember?{" "}
            <a className="CreateAccount" href="/Forgate">
              {" "}
              Forgate Password{" "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
