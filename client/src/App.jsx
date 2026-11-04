import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function Placeholder({ name }) {
  return <main className="page"><h1>{name}</h1></main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Placeholder name="HOME" />} />
        <Route path="/services" element={<Placeholder name="SERVICES" />} />
        <Route path="/login" element={<Placeholder name="LOG IN" />} />
        <Route path="/brief" element={<Placeholder name="AI BRIEF" />} />
        <Route path="/book" element={<Placeholder name="BOOK A CHAT" />} />
        <Route path="/bookings" element={<Placeholder name="MY BOOKINGS" />} />
        <Route path="/admin" element={<Placeholder name="ADMIN" />} />
      </Routes>
    </BrowserRouter>
  );
}