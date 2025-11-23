import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(username.trim(), password);

    if (result.success) {
      navigate("/feed");
    } else {
      setError(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="brand">Social Activity Feed</div>
        <nav>
          <span className="auth-link active">Login</span>
          <Link to="/signup" className="auth-link">
            Signup
          </Link>
        </nav>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="auth-subtitle">
            Log in to see your feed and activity.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <p className="auth-error">{error}</p>}
          </form>

          <p className="auth-footer-text">
            Don&apos;t have an account?{" "}
            <Link to="/signup">Create one</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
