import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Logo from "../../assets/logo.png";

function NavBar() {
  return (
    <Navbar expand="lg" className="nav">
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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={{ marginLeft: "25%" }}>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="tipos-documentais">Tipos Documentais</Nav.Link>
            <Nav.Link href="documentos">Documentos</Nav.Link>
            <Nav.Link href="sobre-nos">Sobre nós</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
