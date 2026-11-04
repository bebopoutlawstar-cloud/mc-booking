import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Services.css";

function price(s) {
  if (!s.priceMin) return "";
  return s.priceMin === s.priceMax ? `$${s.priceMin}` : `$${s.priceMin}–${s.priceMax}`;
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // YOUR PART: same as Home, but save ALL services with setServices(data)
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => setServices([]));
  }, []);

  // Build the chip list from the real categories
  const categories = ["All", ...new Set(services.map((s) => s.category))];

  // Apply the chip and the search box together
  const shown = services.filter(
    (s) =>
      (category === "All" || s.category === category) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="page">
      <div className="svc-head">
        <div>
          <div className="k">{services.length} services · price ranges shown · the chat is free</div>
          <h1>SERVICES</h1>
        </div>
        <input
          id="svc-search"
          className="search"
          placeholder="Search services…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="chips">
        {categories.map((c) => (
          <button key={c} className={c === category ? "chip on" : "chip"} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p>No services match. <button className="link" onClick={() => { setCategory("All"); setSearch(""); }}>Clear filters</button></p>
      ) : (
        <div className="svc-grid">
          {shown.map((s) => (
            <div className="card" key={s._id}>
              <div className="meta">{s.category} · {s.turnaround} · {price(s)}</div>
              <h3>{s.name}</h3>
              <p className="small">{s.description}</p>
              <Link to={`/services/${s._id}`} className="btn outline small-btn">View details</Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}