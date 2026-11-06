import { useEffect, useState } from "react";
import { useLocation, useSearchParams, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Book.css";

const TIMES = ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

export default function Book() {
  const { user, token, checking } = useAuth();
  const location = useLocation();
  const [params] = useSearchParams();

  // Pre-fill from the AI page (state) or the details page (?service=...&package=...)
  const fromAI = location.state || {};
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState(fromAI.serviceId || params.get("service") || "");
  const [pkg, setPkg] = useState(params.get("package") || "standard");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const brief = fromAI.brief || null;

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null); // the saved booking, once it works

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices).catch(() => {});
  }, []);

  if (checking) return <main className="page"><p>Loading…</p></main>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} />;

  const chosen = services.find((s) => s._id === serviceId);
  const today = new Date().toISOString().slice(0, 10); // can't book in the past

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!serviceId || !date || !time) {
      setError("Pick a service, a date and a time.");
      return;
    }
    setBusy(true);
    try {
      // Turn the date + time the client picked into one exact moment
      const dateTime = new Date(`${date}T${time}`).toISOString();

      // YOUR PART:
      // 1. const res = await fetch("/api/bookings", ...)
      //    method POST, the same two headers as the AI page
      //    body: JSON.stringify({ service: serviceId, dateTime, package: pkg, brief, notes })
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ service: serviceId, dateTime, package: pkg, brief, notes })
      });
      // 2. const data = await res.json()
        const data = await res.json();
      // 3. if (!res.ok) throw new Error(data.message)
        if (!res.ok) throw new Error(data.message);
      // 4. setDone(data)
        setDone(data);
    } catch (err) {
      setError(err.message); // e.g. "That time was just booked. Please pick another."
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="page book-page">
        <div className="card success">
          <div className="k">Request sent</div>
          <h1>YOU'RE BOOKED IN: <span className="pending">PENDING</span></h1>
          <p>{chosen?.name} · {new Date(done.dateTime).toLocaleString([], { dateStyle: "full", timeStyle: "short" })}</p>
          <p>MC Productions will confirm within 24 hours. You'll see the status change in My Bookings.</p>
          <Link to="/bookings" className="btn big">Go to My Bookings</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page book-page">
      <div>
        <div className="k">Free 20-minute chat</div>
        <h1>BOOK A CHAT</h1>
      </div>

      <form className="card book-form" onSubmit={handleSubmit}>
        <label htmlFor="svc">Service</label>
        <select id="svc" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
          <option value="">Choose a service…</option>
          {services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        {chosen?.priceMin && (
          <p className="small">Price range: ${chosen.priceMin}{chosen.priceMax !== chosen.priceMin ? `–${chosen.priceMax}` : ""} · exact quote after the chat</p>
        )}

        <label>Package</label>
        <div className="chips">
          <button type="button" className={pkg === "standard" ? "chip on" : "chip"} onClick={() => setPkg("standard")}>Standard · 2 rounds</button>
          <button type="button" className={pkg === "quick cut" ? "chip on" : "chip"} onClick={() => setPkg("quick cut")}>Quick Cut · 1 round</button>
        </div>

        <label htmlFor="date">Date</label>
        <input id="date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Time</label>
        <div className="chips">
          {TIMES.map((t) => (
            <button type="button" key={t} className={time === t ? "chip on" : "chip"} onClick={() => setTime(t)}>{t}</button>
          ))}
        </div>

        {brief && (
          <div className="card attached">
            <div className="meta">✦ AI brief attached</div>
            <p className="small">{brief.goal}</p>
          </div>
        )}

        <label htmlFor="notes">Anything else?</label>
        <textarea id="notes" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />

        {error && <p className="error">{error}</p>}

        <button className="btn big ai" disabled={busy}>{busy ? "Sending…" : "Confirm booking"}</button>
      </form>
    </main>
  );
}