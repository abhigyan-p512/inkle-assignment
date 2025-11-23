import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signup(
      name.trim(),
      username.trim(),
      email.trim(),
      password
    );

    if (result.success) {
      navigate("/feed"); // user is already logged in
    } else {
      setError(result.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="brand">Social Activity Feed</div>
        <nav>
          <Link to="/login" className="auth-link">
            Login
          </Link>
          <span className="auth-link active">Signup</span>
        </nav>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <h1>Signup</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Full name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Creating account..." : "Create account"}
            </button>

            {error && <p className="auth-error">{error}</p>}
          </form>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
