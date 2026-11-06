import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="nav">
      <Link to="/" className="logo">
        <span className="clap"></span>MC <i>PRODUCTIONS</i>
      </Link>

      <div className="links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/services">Services</NavLink>
        {/* Clients see the booking tools; the studio owner sees the dashboard */}
        {!isAdmin && <NavLink to="/brief">AI Brief</NavLink>}
        {!isAdmin && <NavLink to="/bookings">My Bookings</NavLink>}
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </div>

      {user ? (
        <div className="signed-in">
          <span className="hi">
            <span className="dot"></span>Signed in as {user.name}
          </span>
          <button className="btn outline" onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <Link to="/login" className="btn">Log in</Link>
      )}
    </nav>
  );
}
