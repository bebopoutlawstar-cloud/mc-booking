import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const goTo = location.state?.from || "/"; // send them back where they came from

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser reloading the page
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate(goTo); // success: back to where they were
    } catch (err) {
      setError(err.message); // e.g. "Invalid email or password"
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page login-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <div className="tabs">
          <button type="button" className={mode === "login" ? "on" : ""} onClick={() => setMode("login")}>Log in</button>
          <button type="button" className={mode === "register" ? "on" : ""} onClick={() => setMode("register")}>Register</button>
        </div>

        {mode === "register" && (
          <>
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </>
        )}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="error">{error}</p>}
        
        <button className="btn big" disabled={busy}>
          {busy ? "One moment…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </main>
  );
}