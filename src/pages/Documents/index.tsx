import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Spinner,
  Table,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import * as yup from "yup";
import { format } from "date-fns";

import api from "../../services/api";

import { NavBar } from "../../components";
import Logo from "../../assets/logo.png";
import { dataDocumetationType } from "../DocumentTypes";

interface FormDataDocuments {
  name: string;
  fileUpload: string;
  documentationType: string;
}

interface dataType {
  id: number;
  dataHora: Date;
  nomeDocumento: string;
  tipoDocumentalId: number;
  usuarioId: number;
  arquivoPdf: File;
}

export function Documents() {
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastText, setToastText] = useState<string[]>([]);
  const [dataDocuments, setDataDocuments] = useState([]);
  const [dataDocumentationTypes, setDataDocumentationTypes] = useState([]);

  useEffect(() => {
    setLoadingScreen(true);
    const loadDataDocuments = async () => {
      const { data } = await api.get("/documentos");
      setDataDocuments(data);
    };

    const loadDataDocumentationTypes = async () => {
      const { data } = await api.get("/tiposdocumentais");
      setDataDocumentationTypes(data);
    };

    loadDataDocuments();
    loadDataDocumentationTypes();

    setTimeout(() => {
      setLoadingScreen(false);
    }, 1500);
  }, []);

  const handleSubmit = async (values: FormDataDocuments) => {
    setLoadingButton(true);

    const formData = new FormData();
    formData.append("nomeDocumento", values.name);
    formData.append(
      "documentoDTO",
      `{"tipoDocumentalId": ${values.documentationType}}`
    );
    formData.append("file", values.fileUpload);

    await api
      .post(`/documentos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setToastText([
          "success",
          "O Guardião",
          "Documento enviado com sucesso!",
        ]);
        setLoadingButton(false);
        setModalShow(false);
        setToastShow(true);
        window.location.reload();
      })
      .catch((err) => {
        setToastText([
          "danger",
          "O Guardião",
          `Documento não foi enviado!, ${err}`,
        ]);
        setLoadingButton(false);
        setToastShow(true);
      });
  };

  const schema = yup.object().shape({
    name: yup.string().required("Nome do arquivoobrigatório"),
    fileUpload: yup.string().required("Selecione um arquivo"),
    documentationType: yup.string().required("Tipo documental é obrigatório"),
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

      <div className="container">
        <div className="header">
          <h1>
            <span className="poppins-bold">Documentos</span>
          </h1>
          <Button
            onClick={() => setModalShow(true)}
            className="button-home justify-content-center align-items-center"
            style={{ fontSize: "1.2rem" }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
        {loadingScreen ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "45vh",
            }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <div className="table">
              {dataDocuments.length === 0 ? (
                <h6>Nenhum Documento Cadastrado</h6>
              ) : (
                <div>
                  <Table responsive="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome do documento</th>
                        <th>Tipo documental</th>
                        <th>Tempo de retenção</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataDocuments.map((item: dataType) => {
                        const documentType = dataDocumentationTypes.find(
                          (type: dataDocumetationType) =>
                            type.id === item.tipoDocumentalId
                        );

                        return (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nomeDocumento}</td>
                            <td>
                              {documentType
                                ? // @ts-ignore
                                  documentType.nomeDocumento
                                : "Documento não encontrado"}
                            </td>
                            <td>
                              {documentType
                                ? // @ts-ignore
                                  documentType.tempoRetencao
                                : "Documento não encontrado"}
                            </td>
                            <td>
                              {format(new Date(item.dataHora), "dd/MM/yyyy")}
                            </td>

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
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
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
                  Novo Documento
                </Modal.Title>
              </Modal.Header>
              <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                  name: "",
                  fileUpload: "",
                  documentationType: "",
                }}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Modal.Body>
                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="description"
                      >
                        <Form.Label>Nome do Documento</Form.Label>
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

                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Arquivo</Form.Label>
                        <Form.Control
                          type="file"
                          name="fileUpload"
                          accept=".pdf"
                          onChange={handleChange}
                          isInvalid={touched.fileUpload && !!errors.fileUpload}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fileUpload}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group controlId="formSelect" className="mb-3">
                        <Form.Label>Tipo documental</Form.Label>
                        <Form.Select
                          aria-label="Tipo documental"
                          name="documentationType"
                          value={values.documentationType}
                          onChange={handleChange}
                          isInvalid={
                            touched.documentationType &&
                            !!errors.documentationType
                          }
                        >
                          <option>Selecione uma opção</option>
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.documentationType}
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
                        Enviar
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </Modal>
          </>
        )}
      </div>
    </>
  );
}
