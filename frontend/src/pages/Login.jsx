
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api";
import { DEMO_CREDENTIALS, DEMO_TOKEN } from "../mockApi";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Demo login works in local development and on Vercel.
      if (
        email.trim().toLowerCase() ===
        DEMO_CREDENTIALS.email.toLowerCase()
      ) {
        if (password !== DEMO_CREDENTIALS.password) {
          throw new Error("Invalid demo email or password.");
        }

        localStorage.setItem("token", DEMO_TOKEN);
        navigate("/dashboard", { replace: true });
        return;
      }

      // Normal login requires a working backend.
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const token = response.data?.token;

      if (!token) {
        throw new Error(
          "The server did not return an authentication token."
        );
      }

      localStorage.setItem("token", token);

      await api.get("/profile");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      localStorage.removeItem("token");

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">HealthVault</div>

        <h1>Welcome back</h1>

        <p className="auth-subtitle">
          Login to access your health dashboard.
        </p>

        <p className="auth-subtitle">
          <strong>Hackathon demo login</strong>
          <br />
          Email: {DEMO_CREDENTIALS.email}
          <br />
          Password: {DEMO_CREDENTIALS.password}
          <br />
          <small>
            Demo mode uses sample data stored in this browser.
          </small>
        </p>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={login}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="primary-button full-width"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
