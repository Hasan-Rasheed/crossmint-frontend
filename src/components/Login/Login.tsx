import React, { useEffect, useState } from "react";
import Loader from "../../common/Loader/Loader";

import "../Dashboard.css";
import { API_ENDPOINTS, createHeaders } from "../../config/api";

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ isOpen, onClose }) => {
  console.log("props", isOpen, onClose);

  // const storedToken = localStorage.getItem("userToken");
  // const storedAdminData = localStorage.getItem("userData");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  // if (!isOpen) return null;
  const storedToken = localStorage.getItem("userToken") || "";
  const storedAdminData = localStorage.getItem("userData") || "";

  console.log("localtorage", storedToken, "\n\n", storedAdminData);
  useEffect(() => {
    if (storedToken && storedAdminData) {
      alert("session exist redirect");
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_REQUEST_OTP, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(
          data.message || "OTP sent successfully to your email"
        );
        setStep("otp");
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_VERIFY_OTP, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      console.log("OTP Verification Response:", {
        status: response.status,
        data,
      });

      if (response.ok && data.success) {
        console.log("OTP Verified Successfully!");
        console.log("Token:", data.data.token);
        console.log("Admin Data:", data.data.admin);

        // Store token in localStorage
        localStorage.setItem("userToken", data.data.token);
        localStorage.setItem("userData", JSON.stringify(data.data.admin));
        console.log("Token and admin data stored in localStorage");

        alert("OTP verified");

        // Call onLogin callback with token and admin data
        console.log("Calling onLogin callback...");
        // onLogin(data.data.token, data.data.admin);
      } else {
        console.error("OTP Verification Failed:", data);
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
            <h2>Login</h2>
            {step == "email" && (
              <form onSubmit={handleEmailSubmit}>
                <div>
                  <div className="input-group">
                    <input
                      type="text"
                      name="field1"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="actions">
                    <button type="button" className="cancel" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="submit" className="submit" disabled={loading}>
                      {loading ? <Loader /> : "Send OTP"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="admin-login-form">
                {successMessage && !error && (
                  <div className="success-message">{successMessage}</div>
                )}
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="123456"
                    required
                    disabled={loading}
                    maxLength={6}
                    className="otp-input"
                  />
                </div>

                <button
                  type="submit"
                  className="admin-login-btn"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="resend-container">
                  <span className="resend-text">Didn't receive the code? </span>
                  <button
                    type="button"
                    className="resend-link"
                    // onClick={handleResendOtp}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
