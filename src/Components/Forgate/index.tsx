import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
function Forgot() {
  const [sendOTP, setsendOTP] = useState<boolean>(true);
  const [checkOTP, setcheckOTP] = useState<boolean>(false);
  const [checkPassword, setcheckPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<any>();
  const [password, setPassword] = useState<any>();
  const [rePassword, setRePassword] = useState<any>();
  const [OTP, setOTP] = useState<any>();
  const [EnterOTP, setEnterOTP] = useState<any>();
  const [error, setError] = useState<any>({
    visible: false,
    message: "",
  });
  const OTPURL = `http://10.37.55.112:5000/otp`;
  const checkUserURL = `http://10.37.55.112:5000/checkUser`;
  const forgotURL = `http://10.37.55.112:5000/forgot`;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

  const handleSignup = async () => {
    switch (true) {
      case !password:
        setError({ visible: true, message: "password is required" });
        break;
      case !rePassword:
        setError({ visible: true, message: "Varify password is required" });
        break;
      case !passwordRegex.test(password):
        setError({
          visible: true,
          message: "Please enter strong password.(8-16)",
        });
        break;
      case password !== rePassword:
        setError({ visible: true, message: "Passwords dosen't match" });
        break;
      case password === rePassword:
        await axios
          ?.put(forgotURL, {
            username: username,
            newpassword: password,
          })
          .then((response: any) => {
            setError({ visible: false, message: "" });
            if (response.data.result === "success") {
              MySwal.fire({
                title: <strong>Thanks</strong>,
                html: <i>Your account password has been changed</i>,
                icon: "success",
              }).then(() => {
                window.location.href = "/";
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
    }
  };

  const handlesendOTP = async () => {
    if (username != null) {
      await axios
        ?.post(checkUserURL, {
          username: username,
        })
        .then(async (response: any) => {
          if (response.data.result) {
            await axios
              ?.post(OTPURL, {
                email: username,
              })
              .then((response: any) => {
                setOTP(parseInt(response?.data?.otp));
                setsendOTP(false);
                setcheckOTP(true);
                setError({ message: "", visible: false });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            setError({ visible: true, message: "Username not found" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setError({ visible: true, message: "Username is require" });
    }
  };

  const handleOTP = async () => {
    if (OTP === EnterOTP) {
      setcheckOTP(false);
      setError({ visible: false, message: "" });
      setcheckPassword(true);
    } else {
      setError({
        visible: true,
        message: "Invalid OTP, please check and try again",
      });
    }
  };

  return (
    <div className="mainSignUp">
      <div className="signUpContainer">
        <div className="signUp">Forgot Password</div>
        <div className="inputs">
          <input
            placeholder="Enter Username"
            type="text"
            className="text"
            name="email"
            onChange={(e: any) => setUsername(e?.target?.value)}
          />
          {sendOTP && (
            <input
              type="button"
              className="OTPBtn"
              value="Send OTP"
              onClick={handlesendOTP}
            />
          )}
          {checkOTP && (
            <>
              <input
                type="number"
                name="OTP"
                id=""
                placeholder="Enter OTP"
                onChange={(e: any) => setEnterOTP(parseInt(e?.target?.value))}
              />
              <input
                type="button"
                className="OTPBtn"
                value="Submit OTP"
                onClick={handleOTP}
              />{" "}
            </>
          )}
          {checkPassword && (
            <>
              <input
                placeholder="New Password"
                type="password"
                className="text"
                name="password"
                onChange={(e: any) => setPassword(e?.target?.value)}
              />
              <input
                placeholder="Verify Password"
                type="password"
                className="text"
                name="repassword"
                onChange={(e: any) => setRePassword(e?.target?.value)}
              />

              <input
                type="button"
                className="OTPBtn"
                value="Submit"
                onClick={handleSignup}
              />
            </>
          )}
          <p
            className="error"
            style={{
              visibility: error.visible === false ? "hidden" : "visible",
            }}
          >
            {error.message}
          </p>

          <div>
            Back To Login?{" "}
            <a className="signUpAccount" href="/">
              {" "}
              Login{" "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
