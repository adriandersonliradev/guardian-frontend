import { Button } from "react-bootstrap";
import { NavBar } from "../../components/index";

import guardiaoDeDocumentos from "../../assets/guardiaoDeDocumentos.png";

export function Home() {
  return (
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          height: "85vh",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "25%" }}>
          <h1>
            <span className="poppins-bold">Guardião de Documentos</span>
          </h1>
          <span className="poppins-light" style={{ marginTop: "1rem" }}>
            Guarde seus documentos de maneira segura e sem reter documentos não
            importantes com sua própria tabela de temporalidade
          </span>

          <Button
            className="button-home"
            style={{ width: "15rem", marginTop: "2rem" }}
          >
            Registre-se agora
          </Button>
        </div>

        <img
          src={guardiaoDeDocumentos}
          width={"30%"}
          alt="Guardiao de Documentos"
        />
      </div>
    </>
  );
}
