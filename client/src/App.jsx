import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Login from "./pages/Login";
import Brief from "./pages/Brief";
import Book from "./pages/Book";
import MyBookings from "./pages/MyBookings";

function Placeholder({ name }) {
  return <main className="page"><h1>{name}</h1></main>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/brief" element={<Brief />} />
          <Route path="/book" element={<Book />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/admin" element={<Placeholder name="ADMIN" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}