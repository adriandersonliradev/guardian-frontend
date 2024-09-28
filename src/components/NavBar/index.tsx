import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

function NavBar() {
  const isLoggedIn = localStorage.getItem("email") ? true : false;
  const isAdminLoggedIn = Boolean(localStorage.getItem("admin"));
  console.log(isAdminLoggedIn);
  console.log(typeof isAdminLoggedIn);

  return (
    <Navbar collapseOnSelect expand="lg" className="nav">
      <Container>
        <Navbar.Brand href="/" className="poppins-semibold">
          <img
            alt=""
            src={Logo}
            width="60"
            height="60"
            className="d-inline-block"
          />{" "}
          O Guardião
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav style={{ display: "flex", alignItems: "center" }}>
            {isLoggedIn && (
              <>
                <Nav.Link href="documentos">Documentos</Nav.Link>
                <Nav.Link href="tipos-documentais">Tipos Documentais</Nav.Link>
                {isAdminLoggedIn && (
                  <Nav.Link href="cadastro">Cadastrar usuário</Nav.Link>
                )}
                <Nav.Link style={{ marginLeft: "3rem" }}>
                  Olá, {localStorage.getItem("name")}
                </Nav.Link>
                <Nav.Link
                  style={{
                    cursor: "pointer",
                    padding: "0 1rem",
                    width: "5.4rem",
                    height: "2rem",
                    backgroundColor: "var(--red)",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                >
                  Sair
                  <FontAwesomeIcon
                    icon={faSignOut}
                    style={{ marginLeft: "0.5rem" }}
                  />
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
