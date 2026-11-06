import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Login from "./pages/Login";
import Brief from "./pages/Brief";
import Book from "./pages/Book";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";

const TITLES = {
  "/": "Home",
  "/services": "Services",
  "/login": "Log in",
  "/brief": "AI Brief",
  "/book": "Book a Chat",
  "/bookings": "My Bookings",
  "/admin": "Admin",
};

// Runs on every page change: scrolls to the top and updates the browser tab title
function PageEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const name = pathname.startsWith("/services/") ? "Service details" : TITLES[pathname] || "Not found";
    document.title = `${name} · MC Productions Booking`;
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <main className="page">
      <div className="k">404</div>
      <h1>PAGE NOT FOUND</h1>
      <p>That page doesn't exist.</p>
      <div><Link to="/" className="btn">Back to Home</Link></div>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageEffects />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/brief" element={<Brief />} />
          <Route path="/book" element={<Book />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
