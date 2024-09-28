import { Route, Routes } from "react-router-dom";

import "./global.css";
import { Home } from "./pages/Home";
import { DocumentTypes } from "./pages/DocumentTypes";
import { Documents } from "./pages/Documents";
import { Expired } from "./pages/Expired";
import { Register } from "./pages/Register";

export function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tipos-documentais" element={<DocumentTypes />} />
        <Route path="/documentos" element={<Documents />} />
        <Route path="/expirados" element={<Expired />} />
        <Route path="/cadastro" element={<Register />} />
      </Routes>
    </div>
  );
}
