// src/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NotFound = () => {
  const { user } = useAuth();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: "10rem",
          fontWeight: "bold",
          color: "#5669db",
          marginBottom: "-1rem",
        }}
      >
        404
      </span>
      <h1>Página Não Encontrada</h1>
      <p>A página que você está tentando acessar não existe.</p>
      <Link to={user ? "/documentos" : "/"} style={{ marginTop: "2rem" }}>
        <span
          style={{
            color: "var(--purple)",
            textDecoration: "underline",
          }}
        >
          Voltar para a página inicial
        </span>
      </Link>
    </div>
  );
};

export default NotFound;
