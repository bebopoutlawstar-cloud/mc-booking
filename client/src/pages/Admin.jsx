import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MyBookings.css"; // status pill colours
import "./Admin.css";

const TABS = ["pending", "confirmed", "declined", "cancelled", "all"];

export default function Admin() {
  const { user, token, checking } = useAuth();
  const [bookings, setBookings] = useState(null); // null = still loading
  const [error, setError] = useState("");
  const [tab, setTab] = useState("pending"); // pending first, per the user flow
  const [open, setOpen] = useState(null); // which booking's brief is showing
  const [working, setWorking] = useState(null); // which booking is being updated

  async function load() {
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBookings(data);
    } catch {
      setError("Couldn't load bookings.");
    }
  }

  useEffect(() => {
    if (token && user?.role === "admin") load();
  }, [token, user]);

  async function setStatus(id, status) {
    setWorking(id);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Update just that row, so the list doesn't jump around
      setBookings((list) => list.map((b) => (b._id === id ? { ...b, status: data.status } : b)));
    } catch (err) {
      setError(err.message);
    } finally {
      setWorking(null);
    }
  }

  if (checking) return <main className="page"><p>Loading…</p></main>;
  if (!user) return <Navigate to="/login" state={{ from: "/admin" }} />;
  if (user.role !== "admin") return <Navigate to="/" />;
  if (!bookings && !error) return <main className="page"><p>Loading bookings…</p></main>;

  const list = bookings || [];
  const count = (s) => list.filter((b) => s === "all" || b.status === s).length;
  const shown = list.filter((b) => tab === "all" || b.status === tab);
  const now = new Date();
  const upcoming = list.filter((b) => b.status === "confirmed" && new Date(b.dateTime) > now).length;

  return (
    <main className="page">
      <div>
        <div className="k">Studio owner</div>
        <h1>ADMIN DASHBOARD</h1>
      </div>

      <div className="stats">
        <div className="card stat"><div className="meta">Waiting for you</div><b className="y">{count("pending")}</b></div>
        <div className="card stat"><div className="meta">Upcoming confirmed</div><b className="c">{upcoming}</b></div>
        <div className="card stat"><div className="meta">All bookings</div><b>{list.length}</b></div>
      </div>

      {error && (
        <div className="card fail">
          <p className="error">{error}</p>
          <button className="btn outline" onClick={load}>Try again</button>
        </div>
      )}

      <div className="chips">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? "chip on" : "chip"} onClick={() => setTab(t)}>
            {t} ({count(t)})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="card empty">
          <p>{tab === "pending" ? "No pending requests. You're all caught up." : `No ${tab === "all" ? "" : tab + " "}bookings.`}</p>
        </div>
      ) : (
        <div className="list">
          {shown.map((b) => {
            const past = new Date(b.dateTime) < now;
            return (
              <div className={`card row ${past ? "past" : ""}`} key={b._id}>
                <div className="admin-row">
                  <div className="when">
                    <b>{new Date(b.dateTime).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</b>
                    <span>{new Date(b.dateTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                    {past && <span className="past-tag">Past</span>}
                  </div>
                  <div>
                    <b>{b.user?.name || "Deleted user"}</b>
                    <p className="small">{b.user?.email}</p>
                  </div>
                  <div>
                    <b>{b.service?.name || "Service"}</b>
                    <p className="small">{b.package}</p>
                  </div>
                  <span className={`pill ${b.status}`}>{b.status}</span>
                  <div className="row-btns">
                    {(b.brief?.goal || b.notes) && (
                      <button className="link" onClick={() => setOpen(open === b._id ? null : b._id)}>
                        {open === b._id ? "Hide brief" : "Read brief"}
                      </button>
                    )}
                    {b.status === "pending" && (
                      <button className="btn small-btn" disabled={working === b._id} onClick={() => setStatus(b._id, "confirmed")}>
                        Confirm
                      </button>
                    )}
                    {["pending", "confirmed"].includes(b.status) && (
                      <button className="btn outline small-btn danger" disabled={working === b._id} onClick={() => setStatus(b._id, "declined")}>
                        Decline
                      </button>
                    )}
                  </div>
                </div>

                {open === b._id && (
                  <div className="brief-view">
                    {b.brief && Object.entries(b.brief).map(([k, v]) => v && <p key={k}><b>{k}:</b> {v}</p>)}
                    {b.notes && <p><b>Client notes:</b> {b.notes}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
