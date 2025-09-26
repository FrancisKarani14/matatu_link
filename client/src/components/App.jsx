import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Saccos from "./pages/Saccos";
import Matatus from "./pages/Matatus";
import Routes_pages from "./pages/Routes_pages";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Saccos routes - explicit paths */}
        <Route path="/saccos" element={<Saccos />} />
        <Route path="/saccos/:saccoId/routes" element={<Routes_pages />} />
        <Route path="/saccos/:saccoId/matatus" element={<Matatus />} />

        {/* Matatus */}
        <Route path="/matatus" element={<Matatus />} />

        {/* All routes page */}
        <Route path="/routes" element={<Routes_pages />} />

     
      </Routes>
    </BrowserRouter>
  );
}

export default App;