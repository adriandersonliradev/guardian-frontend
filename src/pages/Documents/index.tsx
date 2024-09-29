import { useEffect, useState } from "react";
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
import {
  faClockRotateLeft,
  faDownload,
  faEdit,
  faPlus,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import * as yup from "yup";
import { format, parseISO } from "date-fns";

import api from "../../services/api";

import { NavBar } from "../../components";
import Logo from "../../assets/logo.png";
import { dataDocumetationType } from "../DocumentTypes";
import { ModalComponent } from "../../components/Modal";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "../../components/Pagination";

interface FormDataDocuments {
  name: string;
  autoClassification: boolean;
  fileUpload: File;
  documentationType: string;
}

interface FormEditDataDocuments {
  name: string;
  documentationType: string;
}

export interface dataType {
  id: number;
  dataHora: Date;
  nomeDocumento: string;
  tipoDocumentalId: number;
  usuarioId: number;
  arquivoPdf: File;
}

export function Documents() {
  const navigate = useNavigate();
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const [formModalShow, setFormModalShow] = useState(false);
  const [formEditModalShow, setFormEditModalShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [item, setItem] = useState({} as dataType);
  const [toastShow, setToastShow] = useState(false);
  const [toastText, setToastText] = useState<string[]>([]);
  const [dataDocuments, setDataDocuments] = useState<dataType[]>([]);
  const [dataDocumentationTypes, setDataDocumentationTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState<dataType[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setTotalPerPage] = useState(5);

  // Pagination - Get Current Posts
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination - change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setLoadingScreen(true);
    const loadDataDocuments = async () => {
      const { data } = await api.get("/documentos");
      data.sort((itemA: any, itemB: any) => itemA.id - itemB.id);
      setDataDocuments(data);

      setFiltered(data);
    };

    const loadDataDocumentationTypes = async () => {
      const { data } = await api.get("/tiposdocumentais");
      setDataDocumentationTypes(data);
    };

    loadDataDocuments();
    loadDataDocumentationTypes();

    setTimeout(() => {
      setLoadingScreen(false);
    }, 500);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.value === "") {
      setFiltered(dataDocuments);
    }
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const filteredItems = dataDocuments.filter((item) =>
      item.nomeDocumento.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredItems);
  };

  const handleDelete = async (id: number) => {
    setLoadingScreen(true);
    await api
      .delete(`/documentos/${id}`)
      .then(async () => {
        setToastText([
          "success",
          "O Guardável",
          "Documento excluído com sucesso!",
        ]);
        setLoadingScreen(false);
        setToastShow(true);
        const { data } = await api.get("/documentos");
        setDataDocuments(data);
        setFiltered(data);
      })
      .catch((err) => {
        setToastText([
          "danger",
          "O Guardável",
          `Documento não foi excluído!, ${err}`,
        ]);
        setLoadingScreen(false);
        setToastShow(true);
      });
  };

  const handleSubmit = async (values: FormDataDocuments) => {
    setLoadingButton(true);

    const formData = new FormData();
    formData.append(
      "documentoDTO",
      JSON.stringify({
        nomeDocumento: values.name,
        tipoDocumentalId: values.documentationType,
      })
    );

    // @ts-ignore
    formData.append("file", values.fileUpload[0]);

    await api
      .post(`/documentos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async () => {
        setToastText([
          "success",
          "O Guardião",
          "Documento cadastrado com sucesso!",
        ]);
        setLoadingButton(false);
        setFormModalShow(false);
        setToastShow(true);
        const { data } = await api.get("/documentos");
        data.sort((itemA: any, itemB: any) => itemA.id - itemB.id);
        setDataDocuments(data);
        setFiltered(data);
      })
      .catch((err) => {
        setToastText([
          "danger",
          "O Guardião",
          `Documento não foi cadastrado!, ${err}`,
        ]);
        setLoadingButton(false);
        setToastShow(true);
      });
  };

  const handleEditSubmit = async (values: FormEditDataDocuments) => {
    setLoadingButton(true);

    const formData = new FormData();
    formData.append(
      "documentoDTO",
      JSON.stringify({
        id: item.id,
        nomeDocumento: values.name,
        tipoDocumentalId: values.documentationType,
      })
    );

    const pdfFile = new File(
      // @ts-ignore
      [Uint8Array.from(atob(item.arquivoPdf), (c) => c.charCodeAt(0))],
      `${item.nomeDocumento}.pdf`,
      { type: "application/pdf" }
    );

    //@ts-ignore
    formData.append("file", pdfFile);

    await api
      .post(`/documentos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async () => {
        setToastText([
          "success",
          "O Guardião",
          "Documento editado com sucesso!",
        ]);
        setLoadingButton(false);
        setFormEditModalShow(false);
        setToastShow(true);
        const { data } = await api.get("/documentos");
        data.sort((itemA: any, itemB: any) => itemA.id - itemB.id);

        setDataDocuments(data);
        setFiltered(data);
      })
      .catch((err) => {
        setToastText([
          "danger",
          "O Guardião",
          `Documento não foi editado!, ${err}`,
        ]);
        setLoadingButton(false);
        setToastShow(true);
      });
  };

  const handleDownload = async (item: dataType) => {
    setLoadingScreen(true);
    const { data } = await api.get(`/documentos/${item.id}/arquivo`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.nomeDocumento}.pdf`;
    document.body.appendChild(link);
    link.click();
    setLoadingScreen(false);
  };

  const handleAutoClassification = async (file: File) => {
    setLoadingModal(true);

    const formData = new FormData();
    // @ts-ignore
    formData.append("file", file[0]);

    const { data } = await api
      .post(`/tiposdocumentais/verificartipoarquivopdf`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .finally(() => {
        setLoadingModal(false);
      });

    return data;
  };

  const schema = yup.object().shape({
    name: yup.string().required("Nome do arquivo obrigatório"),
    autoClassification: yup.boolean(),
    fileUpload: yup
      .mixed()
      .required("O arquivo é obrigatório")
      .test("fileSize", "O arquivo é muito grande", (value) => {
        if (value) {
          // @ts-ignore
          return value[0].size <= 1048576;
        }
        return true;
      })
      .test("fileType", "O formato do arquivo é inválido", (value) => {
        if (value) {
          // @ts-ignore
          return ["application/pdf"].includes(value[0].type);
        }
        return true;
      }),
    documentationType: yup.string().required("Tipo documental é obrigatório"),
  });

  const schemaEdit = yup.object().shape({
    name: yup.string().required("Nome do arquivo obrigatório"),
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
          <div className="d-flex align-items-center">
            {dataDocuments.length > 0 && (
              <div>
                <Form className="d-flex">
                  <InputGroup style={{ width: "20rem" }}>
                    <Form.Control
                      type="text"
                      placeholder="Digite para buscar..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />

                    <Button variant="primary" onClick={handleSearch}>
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </InputGroup>
                </Form>
              </div>
            )}
            <Button
              className="justify-content-center align-items-center"
              style={{
                fontSize: "1.2rem",
                border: "none",
                background: "var(--red)",
                marginLeft: "1rem",
              }}
              onClick={() => {
                navigate("/expirados");
              }}
            >
              <FontAwesomeIcon icon={faClockRotateLeft} />
              <span style={{ marginLeft: "0.5rem", fontSize: "1rem" }}>
                {"Expirados"}
              </span>
            </Button>
            <Button
              onClick={() => setFormModalShow(true)}
              className="button-home justify-content-center align-items-center"
              style={{ fontSize: "1.2rem", border: "none", marginLeft: "1rem" }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
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
                  <div
                    style={{
                      minHeight: "46vh",
                    }}
                  >
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
                        {currentItems.map((item: dataType) => {
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
                                    `${documentType.tempoRetencao} ${
                                      // @ts-ignore
                                      documentType?.tempoRetencao === 1
                                        ? "ano"
                                        : "anos"
                                    }`
                                  : "Documento não encontrado"}
                              </td>
                              <td>
                                {format(
                                  parseISO(String(item.dataHora)),
                                  "dd/MM/yyyy"
                                )}
                              </td>

                              <td>
                                <Button
                                  key={`download-${item.id}`}
                                  className="button button-download justify-content-center align-items-center"
                                  style={{ fontSize: "1.2rem" }}
                                  onClick={() => {
                                    handleDownload(item);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faDownload} />
                                </Button>
                                <Button
                                  key={`edit-${item.id}`}
                                  onClick={() => {
                                    setFormEditModalShow(true);
                                    setItem(item);
                                  }}
                                  className="button button-edit justify-content-center align-items-center"
                                  style={{ fontSize: "1.2rem" }}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                  key={`delete-${item.id}`}
                                  onClick={() => {
                                    setModalShow(true);
                                    setItem(item);
                                  }}
                                  className="button button-trash justify-content-center align-items-center"
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
                  <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={dataDocuments.length}
                    paginate={paginate}
                  />
                </div>
              )}
            </div>

            {formModalShow && (
              <Modal
                show={formModalShow}
                onHide={() => setFormModalShow(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header
                  closeButton
                  style={{ backgroundColor: "#5669db", color: "#fff" }}
                >
                  <Modal.Title id="contained-modal-title-vcenter">
                    Novo Documento
                  </Modal.Title>
                </Modal.Header>
                <Formik
                  validationSchema={schema}
                  onSubmit={handleSubmit}
                  initialValues={{
                    name: "",
                    autoClassification: true,
                    fileUpload: null as any,
                    documentationType: "",
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
                      {loadingModal && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "50vh",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            width: "100%",
                            zIndex: 100,
                            position: "absolute",
                          }}
                        >
                          <Spinner animation="border" variant="primary" />
                        </div>
                      )}
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

                        <Form.Group controlId="formSwitch" className="mb-3">
                          <Form.Check
                            name="autoClassification"
                            checked={values.autoClassification}
                            onChange={(event) => {
                              setFieldValue(
                                "autoClassification",
                                event.currentTarget.checked
                              );
                            }}
                            type="switch"
                            id="form-switch"
                            label="Classificação de documento automática"
                          />
                        </Form.Group>

                        <Form.Group controlId="formFile" className="mb-3">
                          <Form.Label>Arquivo</Form.Label>
                          <Form.Control
                            type="file"
                            name="fileUpload"
                            accept=".pdf"
                            onChange={async (event) => {
                              setFieldValue(
                                "fileUpload",
                                // @ts-ignore
                                event.currentTarget.files
                              );
                              if (values.autoClassification === true) {
                                const documentationType =
                                  await handleAutoClassification(
                                    // @ts-ignore
                                    event.currentTarget.files
                                  );

                                if (documentationType.status === true) {
                                  setFieldValue(
                                    "documentationType",
                                    documentationType.id
                                  );
                                  setToastText([
                                    "success",
                                    "O Guardião",
                                    `O tipo documental encontrado: ${documentationType.nomeDocumento}`,
                                  ]);
                                  setToastShow(true);
                                } else {
                                  setToastText([
                                    "info",
                                    "O Guardião",
                                    `O tipo documental ${documentationType.nomeDocumento} está inativo, classifique manualmente`,
                                  ]);
                                  setToastShow(true);
                                }
                              }
                            }}
                            isInvalid={
                              touched.fileUpload && !!errors.fileUpload
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {/* @ts-ignore */}
                            {errors?.fileUpload}
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
                            {dataDocumentationTypes
                              .filter(
                                (item: dataDocumetationType) =>
                                  // @ts-ignore
                                  item.status === true
                              )
                              .map((item: dataDocumetationType) => (
                                <option key={item.id} value={item.id}>
                                  {item.nomeDocumento}
                                </option>
                              ))}
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
            )}

            {formEditModalShow && (
              <Modal
                show={formEditModalShow}
                onHide={() => setFormEditModalShow(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header
                  closeButton
                  style={{ backgroundColor: "#5669db", color: "#fff" }}
                >
                  <Modal.Title id="contained-modal-title-vcenter">
                    Editar Documento
                  </Modal.Title>
                </Modal.Header>
                <Formik
                  validationSchema={schemaEdit}
                  onSubmit={handleEditSubmit}
                  initialValues={{
                    name: item?.nomeDocumento,
                    documentationType: item?.tipoDocumentalId.toString(),
                  }}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    values,
                    touched,
                    errors,
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Modal.Body>
                        <Form.Group
                          as={Col}
                          className="mb-3"
                          controlId="formEditDescription"
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

                        <Form.Group controlId="formEditSelect" className="mb-3">
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
                            {dataDocumentationTypes
                              .filter(
                                (item: dataDocumetationType) =>
                                  // @ts-ignore
                                  item.status === true
                              )
                              .map((item: dataDocumetationType) => (
                                <option key={item.id} value={item.id}>
                                  {item.nomeDocumento}
                                </option>
                              ))}
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
                          Editar
                        </Button>
                      </Modal.Footer>
                    </Form>
                  )}
                </Formik>
              </Modal>
            )}

            {modalShow && (
              <ModalComponent
                show={modalShow}
                setShow={setModalShow}
                item={item}
                handleDelete={handleDelete}
                header={`Documento: ${item.nomeDocumento}`}
                message="Tem certeza que deseja excluir esse documento?"
                messageButton="Excluir"
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
