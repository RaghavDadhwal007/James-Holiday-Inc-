import React, { useState } from "react";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URI}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Reset link sent to your email");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
    }
  };

  return (
    <div className="container">
      <div className="forgot-box">
        <h1>Forgot Password</h1>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <button type="submit">Send Reset Link</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
