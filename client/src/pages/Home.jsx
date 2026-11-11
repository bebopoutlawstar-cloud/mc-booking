import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const FEATURED = ["Singing Reel", "Movie Trailer", "Wedding Filming"];

function price(s) {
  if (!s.priceMin) return "";
  return s.priceMin === s.priceMax ? `$${s.priceMin}` : `$${s.priceMin}–${s.priceMax}`;
}

export default function Home() {
  const [featured, setFeatured] = useState([]);

    useEffect(() => {
    // 1. Ask your API for all services
    fetch("/api/services")
      // 2. Turn the response into JSON
      .then((res) => res.json())
      // 3 + 4. Keep only the featured ones and save them
      .then((data) => setFeatured(data.filter((s) => FEATURED.includes(s.name))))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <main className="page home">
      <section className="hero">
        <div className="hero-text">
          <div className="k">Video editing · Filming · Design</div>
          <h1>BOOK YOUR NEXT<br />EDIT WITH MC PRODUCTIONS</h1>
          <p>Real editors, honest prices. Not sure what you need? Describe your idea and our AI assistant points you to the right service.</p>
          <div className="hero-btns">
            <Link to="/services" className="btn big">Get started</Link>
            <Link to="/brief" className="btn big ai">✦ Ask the AI Brief Assistant</Link>
          </div>
          <Link to="/services" className="browse">Browse all services →</Link>
        </div>
                <div className="reel">
          <div className="reel-box">
            <iframe
              src="https://drive.google.com/file/d/1ib0tX_JPt7zkwXPcoQCsoh54N4i0VkGf/preview"
              title="MC Productions editing reel"
              allow="autoplay; fullscreen"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p className="small">Acting reels · trailers · weddings · gaming</p>
        </div>
      </section>

      <section>
        <div className="k">How it works</div>
        <div className="steps">
          <div className="card step ai-step"><b>1 · Describe your idea</b><p>Tell the AI in your own words. It picks the service and writes a clear brief.</p></div>
          <div className="card step"><b>2 · Book a free chat</b><p>See the price range up front, then pick a time that suits you.</p></div>
          <div className="card step"><b>3 · Get your edit</b><p>First cut, your notes, final cut. 2 rounds included as standard.</p></div>
        </div>
      </section>

      <section className="bottom">
        <div>
          <div className="row-head"><h2>FEATURED SERVICES</h2><Link to="/services" className="browse">See all 15 →</Link></div>
          <div className="featured">
            {featured.map((s) => (
              <div className="card" key={s._id}>
                <div className="meta">{s.category} · {s.turnaround} · {price(s)}</div>
                <h3>{s.name}</h3>
                <p className="small">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card why">
          <div className="k">Why a real editor?</div>
          <p>AI can't read your story, your timing or your taste. Our AI helps you explain the idea; a real editor at MC Productions makes the cut.</p>
        </div>
      </section>
    </main>
  );
}