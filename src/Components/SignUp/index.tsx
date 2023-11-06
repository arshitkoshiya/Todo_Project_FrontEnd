import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
function SignUp() {
  const [checkOTP, setcheckOTP] = useState<boolean>(false);
  const [username, setUsername] = useState<any>();
  const [checkuser, setcheckuser] = useState<any>();
  const [password, setPassword] = useState<any>();
  const [rePassword, setRePassword] = useState<any>();
  const [OTP, setOTP] = useState<any>();
  const [EnterOTP, setEnterOTP] = useState<any>();
  const [error, setError] = useState<any>({
    visible: false,
    message: "",
  });

  const SignUpURL = `http://10.37.55.112:5000/signup`;
  const OTPURL = `http://10.37.55.112:5000/otp`;
  const checkUserURL = `http://10.37.55.112:5000/checkUser`;

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

  const handleSignup = async () => {
    if (username) {
      await axios
        ?.post(checkUserURL, {
          username: username,
        })
        .then((response: any) => {
          setcheckuser(response.data.result);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    switch (true) {
      case checkuser:
        setError({ visible: true, message: "Username is already taken" });
        break;
      case !username:
        setError({ visible: true, message: "Username is required" });
        break;
      case !password:
        setError({ visible: true, message: "password is required" });
        break;
      case !rePassword:
        setError({ visible: true, message: "Varify password is required" });
        break;
      case !emailRegex.test(username):
        setError({ visible: true, message: "Invalid email address" });
        break;
      case !passwordRegex.test(password):
        setError({
          visible: true,
          message: "Please enter strong password.(8-16)",
        });
        break;
      case password !== rePassword:
        setError({ visible: true, message: "Passwords do not match" });
        break;
      case password === rePassword:
        await axios
          ?.post(OTPURL, {
            email: username,
          })
          .then((response: any) => {
            if (response.data.result === "Fail") {
              setError({ visible: true, message: "Username is already taken" });
            } else {
              setOTP(parseInt(response?.data?.otp));
              setcheckOTP(true);
              setError({ visible: false });
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
    }
  };
  const handleOTP = async () => {
    if (OTP === EnterOTP) {
      await axios
        ?.post(SignUpURL, {
          username: username,
          password: password,
        })
        .then((response: any) => {
          if (response.data.result === "success") {
            MySwal.fire({
              title: <strong>Thanks</strong>,
              html: <i>Your Account Created Successfully</i>,
              icon: "success",
            }).then(() => {
              window.location.href = "/";
            });
          } else {
            MySwal.fire({
              title: <strong>Sorry</strong>,
              html: <i>{response?.data?.message}</i>,
              icon: "warning",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      MySwal.fire({
        title: <strong>Problem Detected</strong>,
        html: <i>Invalid OTP, Please check and Try Again</i>,
        icon: "warning",
      });
    }
  };

  return (
    <div className="mainSignUp">
      <div className="signUpContainer">
        <div className="signUp">
          Let's <br /> Join Us!
        </div>
        <div className="inputs">
          <input
            placeholder="Enter Username"
            type="text"
            className="text"
            name="email"
            onChange={(e: any) => setUsername(e?.target?.value)}
          />
          {!checkOTP && (
            <>
              <input
                placeholder="Enter Password"
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
                value="SignUp"
                onClick={handleSignup}
              />
            </>
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
          <p
            className="error"
            style={{
              visibility: error.visible === false ? "hidden" : "visible",
            }}
          >
            {error.message}
          </p>
          <div>
            Already have an Account?{" "}
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

export default SignUp;
