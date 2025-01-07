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

import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../home/Home.css";
import "./Auth.css";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    countryCode: "+91",
    phone: "",
    otp: "",
  });

  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Handle Input Change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle Next Button (Move to Step 2)
  const handleNext = () => setStep(2);

  // Handle Phone Verification
  const sendOTP = async () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );

      const result = await signInWithPhoneNumber(
        auth,
        `${userData.countryCode}${userData.phone}`,
        window.recaptchaVerifier
      );

      setConfirmationResult(result);
      setShowOTP(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // Handle OTP Verification
  const verifyOTP = async () => {
    try {
      await confirmationResult.confirm(userData.otp);
      alert("Phone Verified Successfully!");
    } catch (error) {
      console.error("Invalid OTP:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
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
          justifyContent: "center",
          alignItems: "center",
        }}
        borderRadius="15px"
      >
        <AppBar
          position="static"
          style={{ background: "#fefcc1", boxShadow: "none" }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
            <span className="title">Sign Up</span>
          </Toolbar>
        </AppBar>
        {step === 1 ? (
          <>
            <TextField
              className="textfield"
              label="First Name"
              name="firstName"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              className="textfield"
              label="Last Name"
              name="lastName"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              className="textfield"
              type="date"
              label="Birth Date"
              name="birthDate"
              defaultValue=""
              fullWidth
              margin="normal"
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            <Typography>Gender:</Typography>
            <RadioGroup row name="gender" onChange={handleChange}>
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
            <br />
            <button
              className="rounded-button"
              style={{
                width: "400px",
                backgroundColor: "black",
                color: "white",
              }}
              onClick={handleNext}
              sx={{ mt: 2 }}
            >
              Next →
            </button>
          </>
        ) : (
          <>
            <PhoneInput
              label="Phone Number"
              name="phone"
              className="textfield"
              country={"in"} // Default country (India)
              onChange={handleChange}
              inputStyle={{ width: "100%", height: "40px" }}
              dropdownStyle={{ textAlign: "left" }}
            />

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
                onClick={sendOTP}
                sx={{ mt: 2 }}
              >
                Send OTP
              </button>
            ) : (
              <>
                <TextField
                  label="Enter OTP"
                  name="otp"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                />
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
        )}
      </Box>
    </div>
  );
};

export default Signup;
