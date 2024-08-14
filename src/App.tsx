import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./global.css";
import { Home } from "./pages/Home";
import { DocumentTypes } from "./pages/DocumentTypes";
import { AboutUs } from "./pages/AboutUs";
import { Documents } from "./pages/Documents";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tipos-documentais" element={<DocumentTypes />} />
        <Route path="/documentos" element={<Documents />} />
        <Route path="/sobre-nos" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}
