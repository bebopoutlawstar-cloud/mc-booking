import { useState } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Brief.css";

const EXAMPLES = [
  "I'm a singer and want a short reel showing off my voice for Instagram.",
  "I shot 20 minutes of my friend's wedding and want a highlight video.",
  "I need a hype trailer for my indie game's Steam page.",
];
const FIELDS = ["goal", "footage", "tone", "deliverables", "length"];

export default function Brief() {
  const { user, token, checking } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Must be logged in to use the AI (protects your free quota)
  if (checking) return <main className="page"><p>Loading…</p></main>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setBusy(true);
    try {
      // YOUR PART:
      // 1. const res = await fetch("/api/ai/brief", { method: "POST", headers, body })
      //    headers need BOTH:
      //      "Content-Type": "application/json"
      //      Authorization: `Bearer ${token}`
      //    body: JSON.stringify({ description })
      const res = await fetch("/api/ai/brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ description })
      });
      // 2. const data = await res.json()
        const data = await res.json();
      // 3. if (!res.ok) throw new Error(data.message)
        if (!res.ok) throw new Error(data.message);
      // 4. setResult(data)
        setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Lets the client edit the AI's brief before booking
  function editField(field, value) {
    setResult({ ...result, brief: { ...result.brief, [field]: value } });
  }

  function bookWithBrief() {
    navigate("/book", { state: { serviceId: result.serviceId, brief: result.brief } });
  }

  const price = result?.priceMin
    ? result.priceMin === result.priceMax ? `$${result.priceMin}` : `$${result.priceMin}–${result.priceMax}`
    : "";

  return (
    <main className="page brief-page">
      <div>
        <div className="k">✦ AI Brief Assistant</div>
        <h1>TELL US ABOUT YOUR PROJECT</h1>
        <p>Describe it in your own words. No jargon needed. The AI picks the right service and writes a brief for your editor.</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <label htmlFor="desc">Your idea</label>
        <textarea id="desc" rows="4" value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. I want a short video of my band for Instagram…" />
        <div className="examples">
          {EXAMPLES.map((ex) => (
            <button type="button" key={ex} className="chip" onClick={() => setDescription(ex)}>{ex}</button>
          ))}
        </div>
        <button className="btn big ai" disabled={busy}>{busy ? "Writing your brief…" : "✦ Write my brief"}</button>
      </form>

      {error && (
        <div className="card fail">
          <p className="error">{error}</p>
          <Link to="/book" className="btn outline">Book without a brief</Link>
        </div>
      )}

      {result && (
        <div className="card result">
          <div className="k">Recommended service</div>
          <h2>{result.service.toUpperCase()} <span className="price">{price}</span></h2>
          <p>{result.reason}</p>

          {result.followUp && <p className="follow">✦ {result.followUp}</p>}

          <div className="meta" style={{ marginTop: 14 }}>Your brief (edit anything)</div>
          <div className="brief-grid">
            {FIELDS.map((f) => (
              <div key={f}>
                <label htmlFor={`b-${f}`}>{f}</label>
                <input id={`b-${f}`} value={result.brief?.[f] || ""} onChange={(e) => editField(f, e.target.value)} />
              </div>
            ))}
          </div>

          <div className="hero-btns">
            <button className="btn big ai" onClick={bookWithBrief} disabled={!result.serviceId}>Book a chat with this brief</button>
            <button className="btn big outline" onClick={() => setResult(null)}>Start over</button>
          </div>
        </div>
      )}
    </main>
  );
}