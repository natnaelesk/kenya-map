import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Funds from "./pages/Funds";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Governors from "./pages/Governors";
import MPs from "./pages/MPs";
import MPDetail from "./pages/MPDetail";
import MegaDams from "./pages/MegaDams";
import MapView from "./pages/MapView";
import Reviews from "./pages/Reviews";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/governors" element={<Governors />} />
          <Route path="/mps" element={<MPs />} />
          <Route path="/mps/:id" element={<MPDetail />} />
          <Route path="/mega-dams" element={<MegaDams />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
