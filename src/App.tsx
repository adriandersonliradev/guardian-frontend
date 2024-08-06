import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./global.css";
import { Home } from "./pages/Home";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
