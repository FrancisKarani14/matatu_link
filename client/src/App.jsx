import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Saccos from "./pages/Saccos";
import Matatus from "./pages/Matatus";
import Routes_pages from "./pages/Routes_pages";
import SaccoMatatus from "./pages/SaccoMatatus";
import SaccoRoutes from "./pages/SaccoRoutes";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboards */}
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Saccos */}
        <Route path="/saccos" element={<Saccos />} />
        <Route path="/saccos/:saccoId/matatus" element={<SaccoMatatus />} />
        <Route path="/saccos/:saccoId/routes" element={<SaccoRoutes />} />

        {/* Global Matatus + Routes */}
        <Route path="/matatus" element={<Matatus />} />
        <Route path="/routes" element={<Routes_pages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
