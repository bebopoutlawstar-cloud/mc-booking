import { useEffect, useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MyBookings.css";

export default function MyBookings() {
  const { user, token, checking } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState(null); // null = still loading
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null); // which booking's brief is showing

  async function load() {
    try {
      // YOUR PART:
      // 1. const res = await fetch("/api/bookings/mine", { headers: { Authorization: `Bearer ${token}` } })
        const res = await fetch("/api/bookings/mine", {
      // 2. const data = await res.json()
        headers: { Authorization: `Bearer ${token}` }
      });
        const data = await res.json();
      // 3. if (!res.ok) throw new Error(data.message)
        if (!res.ok) throw new Error(data.message);
      // 4. setBookings(data)
        setBookings(data);
    } catch (err) {
      setError("Couldn't load your bookings.");
    }
  }

  useEffect(() => { if (token) load(); }, [token]);

  async function cancel(id) {
    const res = await fetch(`/api/bookings/${id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) load(); // reload the list so the status updates
  }

  if (checking) return <main className="page"><p>Loading…</p></main>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} />;

  if (error) return <main className="page"><p className="error">{error}</p><button className="btn outline" onClick={load}>Try again</button></main>;
  if (!bookings) return <main className="page"><p>Loading your bookings…</p></main>;

  const now = new Date();
  const next = bookings.find((b) => new Date(b.dateTime) > now && ["pending", "confirmed"].includes(b.status));

  return (
    <main className="page">
      <div>
        <div className="k">Your chats</div>
        <h1>MY BOOKINGS</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="card empty">
          <p>No bookings yet.</p>
          <div className="hero-btns">
            <Link to="/brief" className="btn ai">✦ Ask the AI</Link>
            <Link to="/services" className="btn outline">Browse services</Link>
          </div>
        </div>
      ) : (
        <>
          {next && (
            <div className="card next">
              <div className="k">Next chat</div>
              <h2>{new Date(next.dateTime).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</h2>
              <p>{next.service?.name} · {next.package}</p>
            </div>
          )}

          <div className="list">
            {bookings.map((b) => (
              <div className="card row" key={b._id}>
                <div className="row-main">
                  <div>
                    <b>{b.service?.name || "Service"}</b>
                    <p className="small">{new Date(b.dateTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} · {b.package}</p>
                  </div>
                  <span className={`pill ${b.status}`}>{b.status}</span>
                  <div className="row-btns">
                    {b.brief?.goal && (
                      <button className="link" onClick={() => setOpen(open === b._id ? null : b._id)}>
                        {open === b._id ? "Hide brief" : "View brief"}
                      </button>
                    )}
                    {["pending", "confirmed"].includes(b.status) && (
                      <button className="btn outline small-btn danger" onClick={() => cancel(b._id)}>Cancel</button>
                    )}
                  </div>
                </div>
                {open === b._id && (
                  <div className="brief-view">
                    {Object.entries(b.brief).map(([k, v]) => v && <p key={k}><b>{k}:</b> {v}</p>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}