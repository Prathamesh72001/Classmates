import React, { useState } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  AppBar,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../home/Home.css";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import OTPInput from "otp-input-react";

const Login = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    countryCode: "+91",
    phone: "",
    otp: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // ✅ Universal handleChange for all input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // ✅ Handle PhoneInput separately (as it doesn't provide event object)
  const handlePhoneChange = (value, country) => {
    const countryCodeLength = country.dialCode.length || 0;
    const phoneNumber = value.substring(countryCodeLength);
    setUserData((prevData) => ({
      ...prevData,
      countryCode: country.dialCode,
      phone: phoneNumber,
    }));
  };

  // Handle Phone Verification
  const verifyCaptcha = async () => {
    if (!validatePhoneNumber(userData.phone)) return;

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA verified!");
          },
        }
      );

      sendOTP();
    } catch (error) {
      console.error("Error Verifying Captcha:", error);
    }
  };

  const sendOTP = async () => {
    try {
      const phoneNumber = `+${userData.countryCode}${userData.phone}`;
      console.log(phoneNumber);
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      console.log("OTP Sent Successfully!");
      setConfirmationResult(confirmationResult);
      setShowOTP(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // Handle OTP Verification
  const verifyOTP = async () => {
    if (!validateOTP()) return;
    let newErrors = {};
    try {
      await confirmationResult.confirm(userData.otp);
      toast.success(`✅ Logged In Successfully`, {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    } catch (error) {
      console.error("Invalid OTP:", error);
      toast.error("❌ Invalid OTP! Please check and try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      newErrors.otp = "Invalid OTP";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
  };

  // Validate Phone Number
  const validatePhoneNumber = (value) => {
    let newErrors = {};
    if (!value.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(value)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate OTP
  const validateOTP = () => {
    let newErrors = {};
    if (!userData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(userData.otp)) {
      newErrors.otp = "Enter a valid 6-digit OTP";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Box
      sx={{
        width: "400px",
        margin: "auto",
        padding: "25px",
        textAlign: "start",
        mt: 5,
        backgroundColor: "#fefcc1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
      }}
      border="2px solid black"
      borderRadius="15px"
    >
      <AppBar
        position="static"
        style={{ background: "#fefcc1", boxShadow: "none" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
          <span className="title">Login</span>
        </Toolbar>
      </AppBar>

      <>
        <PhoneInput
          label="Phone Number"
          name="phone"
          className="textfield"
          country={"in"} // Default country (India)
          onChange={handlePhoneChange}
          inputStyle={{ width: "100%", height: "40px" }}
          dropdownStyle={{ textAlign: "left" }}
          isValid={() => !errors.phone}
          inputProps={{ name: "phone", required: true }}
          enableLongNumbers={true}
          autoFormat={false} // Try disabling auto formatting (though it may not remove all formatting)
          countryCodeEditable={false}
        />
        {errors.phone && <Typography color="error">{errors.phone}</Typography>}

        <div id="recaptcha-container"></div>

        <br />

        {!showOTP ? (
          <button
            className="rounded-button"
            style={{
              width: "400px",
              backgroundColor: "black",
              color: "white",
            }}
            onClick={verifyCaptcha}
            sx={{ mt: 2 }}
          >
            Send OTP
          </button>
        ) : (
          <>
            <OTPInput
              value={userData.otp}
              onChange={(c) =>
                setUserData((prevData) => ({
                  ...prevData,
                  otp: c,
                }))
              }
              //   onChange={(otp) => setCode(otp)}
              OTPLength={6}
              otpType="number"
              disabled={false}
              inputStyles={{
                border: errors.otp ? "1px solid red" : "1px solid transparent",
                borderRadius: "8px",
                // width: window.innerWidth < "500" ? "30px" : "55px",
                // height: window.innerWidth < "500" ? "30px" : "55px",
                fontSize: "16px",
                background: "#F5F5F5",
                fontWeight: "400",

                // caretColor: "black",
              }}
            />

            <span
              className="text-danger fs14 my-2 d-block fw-bold"
              style={{ marginBottom: "20px", color: "red" }}
            >
              {errors.otp}
            </span>

            <button
              className="rounded-button"
              style={{
                width: "400px",
                backgroundColor: "black",
                color: "white",
              }}
              onClick={verifyOTP}
              sx={{ mt: 2 }}
            >
              Verify OTP
            </button>
          </>
        )}
      </>
    </Box>
  );
};

export default Login;
