import React, { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      email === "admin@accessaudit.com" &&
      password === "admin123"
    ) {
      onLogin({
        name: "AccessAudit Admin",
        email,
      });
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-logo">A</div>
          <h1>AccessAudit</h1>
          <p>Accessibility Audit Management</p>
        </div>

        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Sign in to continue to your workspace.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@accessaudit.com"
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="login-button" type="submit">
            Sign In
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo Credentials</p>
          <span>Email: admin@accessaudit.com</span>
          <span>Password: admin123</span>
        </div>

        <footer className="login-footer">
          © 2026 AccessAudit. All rights reserved.
        </footer>
      </section>
    </main>
  );
}

export default Login;