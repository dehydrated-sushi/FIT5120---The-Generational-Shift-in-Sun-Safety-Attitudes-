import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import UVTracker from "./pages/UVTracker/UVTracker";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uv-tracker" element={<UVTracker />} />
      </Routes>
    </BrowserRouter>
  );
}