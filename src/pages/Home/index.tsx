import {
  Button,
  Col,
  Form,
  InputGroup,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { NavBar } from "../../components/index";

import guardiaoDeDocumentos from "../../assets/guardiaoDeDocumentos.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Logo from "../../assets/logo.png";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import * as yup from "yup";
import api from "../../services/api";

interface FormData {
  email: string;
  password: string;
}

export function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("email") ? true : false;
  const isAdminLoggedIn = Boolean(localStorage.getItem("admin"));
  const [showLogin, setShowLogin] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const [toastShow, setToastShow] = useState(false);
  const [toastText, setToastText] = useState<string[]>([]);

  const [showPassword, setShowPassword] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email("Email inválido").required("Email obrigatório"),
    password: yup
      .string()
      .min(6, "Senha deve conter pelo menos 6 digitos")
      .required("Senha obrigatória"),
  });

  const handleSubmit = async (values: FormData) => {
    try {
      const response = await api.post("usuarios/login", null, {
        params: {
          email: values.email,
          senha: values.password,
        },
      });

      localStorage.setItem("name", response.data.nome);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("admin", response.data.admin);

      setToastText(["success", "O Guardiao", "Login realizado com sucesso!"]);
      setToastShow(true);

      setLoadingButton(false);

      setShowLogin(false);
      navigate("/documentos");
    } catch (error: any) {
      setToastText(["danger", "Erro", error.response.data.message]);
      setToastShow(true);
    }
  };

  return (
    <>
      <ToastContainer
        className="p-3"
        position="top-end"
        style={{ zIndex: 99999 }}
      >
        <Toast
          onClose={() => setToastShow(false)}
          show={toastShow}
          delay={6000}
          autohide
          bg={toastText[0]}
        >
          <Toast.Header>
            <img
              src={Logo}
              width={20}
              height={20}
              className="rounded me-2"
              alt="logo"
            />
            <strong className="me-auto">{toastText[1]}</strong>
          </Toast.Header>
          <Toast.Body style={{ color: "#fff" }}>{toastText[2]}</Toast.Body>
        </Toast>
      </ToastContainer>
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
          {showLogin ? (
            <>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1>
                  <span className="poppins-bold">Entrar</span>
                </h1>
                <Button
                  className="button-home justify-content-center align-items-center"
                  style={{
                    fontSize: "1.2rem",
                    border: "none",
                    marginLeft: "1rem",
                    background: "var(--purple)",
                    width: "2.5rem",
                    height: "2.5rem",
                  }}
                  onClick={() => setShowLogin(false)}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
              </div>
              <div
                style={{ display: "flex", marginTop: "1rem", width: "100%" }}
              >
                <Formik
                  validationSchema={schema}
                  onSubmit={(values, { resetForm }) => {
                    handleSubmit(values);
                    resetForm();
                  }}
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    values,
                    touched,
                    errors,
                  }) => (
                    <Form
                      noValidate
                      onSubmit={handleSubmit}
                      style={{ width: "100%" }}
                    >
                      <Form.Group as={Col} className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="text"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          isInvalid={touched.email && !!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        className="mb-4"
                        controlId="password"
                      >
                        <Form.Label>Senha</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            isInvalid={touched.password && !!errors.password}
                          />
                          <Button
                            variant="outline-secondary"
                            id="button-visible-1"
                            style={{ borderRadius: "0 0.25rem 0.25rem 0" }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <FontAwesomeIcon
                              icon={showPassword ? faEyeSlash : faEye}
                            />
                          </Button>
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <Button
                        type="submit"
                        disabled={loadingButton}
                        className="button-home"
                      >
                        {loadingButton && (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        )}{" "}
                        Entrar
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </>
          ) : (
            <>
              <h1>
                <span className="poppins-bold">Guardião de Documentos</span>
              </h1>
              <span className="poppins-light" style={{ marginTop: "1rem" }}>
                Guarde seus documentos de maneira segura e sem reter documentos
                não importantes com sua própria tabela de temporalidade
              </span>

              <div style={{ display: "flex", marginTop: "2rem" }}>
                {!isLoggedIn && (
                  <Button
                    className="button-home"
                    style={{
                      width: "9rem",
                      marginRight: "1rem",
                      height: "2.5rem",
                    }}
                    onClick={() => {
                      setShowLogin(true);
                    }}
                  >
                    Entrar
                  </Button>
                )}
                {isLoggedIn && isAdminLoggedIn && (
                  <Button
                    className="button-home-register"
                    style={{ width: "15rem", height: "2.5rem" }}
                  >
                    <Link
                      to="/cadastro"
                      style={{ color: "var(--purple) !important" }}
                    >
                      Cadastre agora
                    </Link>
                  </Button>
                )}
              </div>
            </>
          )}
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
