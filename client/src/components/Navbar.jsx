import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="logo">
        <span className="clap"></span>MC <i>PRODUCTIONS</i>
      </Link>

      <div className="links">
        <NavLink to="/" className="link">
          Home
        </NavLink>
        <NavLink to="/services" className="link">
          Services
        </NavLink>
        <NavLink to="/brief" className="link">
          AI Brief
        </NavLink>
        <NavLink to="/bookings" className="link">
          My Bookings
        </NavLink>
      </div>

      <Link to="/login" className="btn">
        Log in
      </Link>
    </nav>
  );
}