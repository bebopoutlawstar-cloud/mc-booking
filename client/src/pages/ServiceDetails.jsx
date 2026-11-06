import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ServiceDetails.css";

function price(s) {
  if (!s.priceMin) return "Ask in the chat";
  return s.priceMin === s.priceMax ? `$${s.priceMin}` : `$${s.priceMin}–${s.priceMax}`;
}

export default function ServiceDetails() {
  const { id } = useParams(); // the ID from /services/:id
  const [service, setService] = useState(null);
  const [error, setError] = useState("");
  const [pkg, setPkg] = useState("standard");

  useEffect(() => {
    // YOUR PART:
    // 1. fetch(`/api/services/${id}`)   (note the backticks)
    fetch(`/api/services/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Service not found");
        }
        return res.json();
      })
      .then((data) => setService(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <main className="page"><h1>NOT FOUND</h1><p>{error}. <Link to="/services" className="browse">Back to services</Link></p></main>;
  if (!service) return <main className="page"><p>Loading…</p></main>;

  return (
    <main className="page">
      <Link to="/services" className="browse">‹ Back to services</Link>
      <div className="details">
        <div>
          <div className="reel-box">Sample video</div>
        </div>
        <div>
          <div className="k">{service.category}</div>
          <h1>{service.name.toUpperCase()}</h1>
          <div className="facts">
            <div className="card"><div className="meta">Price range</div>{price(service)}</div>
            <div className="card"><div className="meta">Turnaround</div>{service.turnaround}</div>
          </div>
          <p>{service.description}</p>

          <div className="meta" style={{ marginTop: 16 }}>Choose your package</div>
          <div className="packages">
            <button className={pkg === "standard" ? "card pkg on" : "card pkg"} onClick={() => setPkg("standard")}>
              <b>Standard · 2 rounds</b><span>First cut + your notes, then the final cut.</span>
            </button>
            <button className={pkg === "quick cut" ? "card pkg on" : "card pkg"} onClick={() => setPkg("quick cut")}>
              <b>Quick Cut · 1 round</b><span>One finished cut, no notes. Same price.</span>
            </button>
          </div>
          <p className="small">The chat is free; exact quote after. Changes beyond the agreed brief are +50%.</p>

          <div className="hero-btns">
            <Link to={`/book?service=${service._id}&package=${pkg}`} className="btn big ai">Book a chat</Link>
            <Link to={`/brief?service=${service._id}`} className="btn big outline">Not sure? Ask the AI</Link>
          </div>
        </div>
      </div>
    </main>
  );
}