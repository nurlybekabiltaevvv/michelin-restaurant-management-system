import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import GuestMenu from "./pages/GuestMenu";
import Waiter from "./pages/Waiter";
import Kitchen from "./pages/Kitchen";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu/:tableId" element={<GuestMenu />} />
        <Route path="/waiter" element={<Waiter />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
