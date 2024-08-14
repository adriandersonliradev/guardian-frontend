import {
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Spinner,
  Table,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { NavBar } from "../../components";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import api from "../../services/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

import Logo from "../../assets/logo.png";

interface FormDataDocumentTypes {
  description: string;
  regulatoryLaw: string;
  retentionPeriod: number;
  status: string;
}

interface dataType {
  id: number;
  nomeDocumento: string;
  leiRegulamentadora: string;
  status: string;
  tempoRetencao: number;
}

export function DocumentTypes() {
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastText, setToastText] = useState<string[]>([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoadingScreen(true);
    const loadData = async () => {
      const { data } = await api.get("/tiposdocumentais");
      console.log(data);
      setData(data);
    };

    loadData();

    setTimeout(() => {
      setLoadingScreen(false);
    }, 2000);
  }, []);

  const handleSubmit = async (values: FormDataDocumentTypes) => {
    setLoadingButton(true);

    const data = {
      nomeDocumento: values.description,
      leiRegulamentadora: values.regulatoryLaw,
      tempoRetencao: String(
        `${values.retentionPeriod} ${
          values.retentionPeriod === 1 ? "ano" : "anos"
        }`
      ),
      status: values.status,
    };

    await api
      .post(`/tiposdocumentais/1`, data)
      .then(() => {
        setToastText([
          "success",
          "O Guardião",
          "Tipo Documental cadastrado com sucesso!",
        ]);
        setLoadingButton(false);
        setModalShow(false);
        setToastShow(true);
      })
      .catch((err) => {
        setToastText([
          "danger",
          "O Guardião",
          `Tipo Documental não foi cadastrado!, ${err}`,
        ]);
        setLoadingButton(false);
        setToastShow(true);
      });
  };

  const schema = yup.object().shape({
    description: yup.string().required("Descrição obrigatória"),
    regulatoryLaw: yup.string().required("Lei Regulamentadora obrigatória"),
    retentionPeriod: yup
      .number()
      .required("Tempo de Vigência obrigatório")
      .min(1, "No mínimo 1 ano")
      .max(1000, "No máximo 1000 anos"),
    status: yup.string().required("Status obrigatório"),
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
      {loadingScreen ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "85vh",
          }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="container">
            <div className="header">
              <h1>
                <span className="poppins-bold">Tipos Documentais</span>
              </h1>
              <Button
                onClick={() => setModalShow(true)}
                className="button-home justify-content-center align-items-center"
                style={{ fontSize: "1.2rem" }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
            <div className="table">
              {data.length === 0 ? (
                <h6>Nenhum Tipo Documental Cadastrado</h6>
              ) : (
                <div>
                  <Table responsive="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Descrição</th>
                        <th>Lei Regulamentadora</th>
                        <th>Tempo de Vigência</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item: dataType) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.nomeDocumento}</td>
                          <td>{item.leiRegulamentadora}</td>
                          <td>{item.tempoRetencao}</td>
                          <td>{item.status}</td>
                          <td>
                            <Button
                              className="button-edit justify-content-center align-items-center"
                              style={{ fontSize: "1.2rem" }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              className="button-trash justify-content-center align-items-center"
                              style={{ fontSize: "1.2rem" }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>

          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Novo Tipo Documental
              </Modal.Title>
            </Modal.Header>
            <Formik
              validationSchema={schema}
              onSubmit={handleSubmit}
              initialValues={{
                description: "",
                regulatoryLaw: "",
                retentionPeriod: 1,
                status: "",
              }}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Modal.Body>
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="description"
                    >
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        autoFocus
                        value={values.description}
                        onChange={handleChange}
                        isInvalid={!!errors.description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput2"
                    >
                      <Form.Label>Lei Regulamentadora</Form.Label>
                      <Form.Control
                        type="text"
                        name="regulatoryLaw"
                        value={values.regulatoryLaw}
                        onChange={handleChange}
                        isInvalid={!!errors.regulatoryLaw}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.regulatoryLaw}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Tempo de Vigência</Form.Label>
                      <InputGroup className="mb-3">
                        <Form.Control
                          type="number"
                          placeholder="Digite um número"
                          name="retentionPeriod"
                          value={values.retentionPeriod}
                          onChange={handleChange}
                          isInvalid={!!errors.retentionPeriod}
                        />
                        <InputGroup.Text id="basic-addon2">
                          {values.retentionPeriod === 1 ? "ano" : "anos"}
                        </InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                          {errors.retentionPeriod}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="formSelect" className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        aria-label="Status"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        isInvalid={!!errors.status}
                      >
                        <option>Selecione uma opção</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.status}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit" disabled={loadingButton}>
                      {loadingButton && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}{" "}
                      Cadastrar
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        </>
      )}
    </>
  );
}
