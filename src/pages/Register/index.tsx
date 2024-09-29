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

import Logo from "../../assets/logo.png";

import guardiaoDeDocumentos from "../../assets/guardiaoDeDocumentos.png";
import { Formik } from "formik";
import * as yup from "yup";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import {
  faArrowDown,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

interface FormDataDocuments {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  admin: boolean;
}

export function Register() {
  const [loadingButton, setLoadingButton] = useState(false);

  const [toastShow, setToastShow] = useState(false);
  const [toastText, setToastText] = useState<string[]>([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values: FormDataDocuments) => {
    setLoadingButton(true);

    const data = {
      nome: values.name,
      email: values.email,
      senha: values.password,
      admin: values.admin,
    };

    await api
      .post(`/usuarios`, data)
      .then(async () => {
        setToastText([
          "success",
          "O Guardião",
          "Usuário cadastrado com sucesso!",
        ]);
        setLoadingButton(false);
        setToastShow(true);
      })
      .catch((err) => {
        setToastText([
          "danger",
          "O Guardião",
          `Usúario não foi cadastrado!, ${err}`,
        ]);
        setLoadingButton(false);
        setToastShow(true);
      });
  };

  const schema = yup.object().shape({
    name: yup.string().required("Nome do usúario é obrigatório"),
    email: yup
      .string()
      .required("Email é obrigatório")
      .email("Email é inválido"),
    password: yup.string().min(6).required("Senha é obrigatória"),
    confirmPassword: yup
      .string()
      .required("Confirme sua senha")
      .oneOf([yup.ref("password")], "Senhas não conferem"),
    admin: yup.boolean(),
  });

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
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2>
            <span className="poppins-bold">Criar conta</span>
          </h2>
          <span className="poppins-light" style={{ marginTop: ".5rem" }}>
            Crie a conta para ter acesso a todos os recursos do Guardião de
            Documentos
          </span>

          <Formik
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
              resetForm();
            }}
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              admin: false,
            }}
          >
            {({
              setFieldValue,
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "2rem",
                    gap: "2rem",
                  }}
                >
                  <Form.Group as={Col} className="mb-3" controlId="name">
                    <Form.Label>Nome do usuário</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      autoFocus
                      value={values.name}
                      onChange={handleChange}
                      isInvalid={touched.name && !!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

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
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "2rem",
                  }}
                >
                  <Form.Group as={Col} className="mb-3" controlId="password">
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

                  <Form.Group
                    as={Col}
                    className="mb-3"
                    controlId="confirmPassword"
                  >
                    <Form.Label>Confirmar senha</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        isInvalid={
                          touched.confirmPassword && !!errors.confirmPassword
                        }
                      />
                      <Button
                        variant="outline-secondary"
                        id="button-visible-2"
                        style={{ borderRadius: "0 0.25rem 0.25rem 0" }}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                        />
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Form.Group controlId="formSwitch">
                    <Form.Check
                      name="autoClassification"
                      checked={values.admin}
                      onChange={(event) => {
                        setFieldValue("admin", event.currentTarget.checked);
                      }}
                      type="switch"
                      id="form-switch"
                      label="É administrador?"
                    />
                  </Form.Group>

                  <Button
                    style={{
                      borderColor: "var(--purple)",
                      backgroundColor: "var(--purple)",
                      marginTop: "1rem",
                    }}
                    type="submit"
                    disabled={loadingButton}
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
                    Enviar
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
