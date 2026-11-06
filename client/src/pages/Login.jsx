import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from; // where they were before being sent here

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in? No need to see this page
  if (user && !busy) return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser reloading the page
    setError("");
    if (mode === "register" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setError("Password needs at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      const u = mode === "login"
        ? await login(email, password)
        : await register(name, email, password);
      // Back to where they were; otherwise admin goes to the dashboard, clients to Home
      navigate(from || (u.role === "admin" ? "/admin" : "/"), { replace: true });
    } catch (err) {
      setError(err.message); // e.g. "Invalid email or password"
      setBusy(false);
    }
  }

  return (
    <main className="page login-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <div className="tabs">
          <button type="button" className={mode === "login" ? "on" : ""} onClick={() => { setMode("login"); setError(""); }}>Log in</button>
          <button type="button" className={mode === "register" ? "on" : ""} onClick={() => { setMode("register"); setError(""); }}>Register</button>
        </div>

        {from && <p className="small">Log in to continue. You'll go straight back to where you were.</p>}

        {mode === "register" && (
          <>
            <label htmlFor="name">Name</label>
            <input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </>
        )}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === "register" && <p className="small">At least 6 characters.</p>}

        {error && <p className="error">{error}</p>}

        <button className="btn big" disabled={busy}>
          {busy ? "One moment…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </main>
  );
}
