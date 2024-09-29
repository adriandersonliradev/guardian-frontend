import { Route, Routes } from "react-router-dom";

import "./global.css";
import { Home } from "./pages/Home";
import { DocumentTypes } from "./pages/DocumentTypes";
import { Documents } from "./pages/Documents";
import { Expired } from "./pages/Expired";
import { Register } from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";

export function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/tipos-documentais"
          element={
            <PrivateRoute>
              <DocumentTypes />
            </PrivateRoute>
          }
        />
        <Route
          path="/documentos"
          element={
            <PrivateRoute>
              <Documents />
            </PrivateRoute>
          }
        />
        <Route
          path="/expirados"
          element={
            <PrivateRoute>
              <Expired />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastro"
          element={
            <PrivateRoute adminRoute>
              <Register />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
