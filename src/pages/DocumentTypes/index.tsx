import { useEffect, useState } from "react";
import {
  Badge,
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
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import * as yup from "yup";

import api from "../../services/api";

import { NavBar } from "../../components";
import Logo from "../../assets/logo.png";
import { ModalComponent } from "../../components/Modal";
import { Pagination } from "../../components/Pagination";
import { useAuth } from "../../context/AuthContext";

interface FormDataDocumentTypes {
  description: string;
  regulatoryLaw: string;
  retentionPeriod: number;
  status: string;
}

export interface dataDocumetationType {
  id: number;
  nomeDocumento: string;
  leiRegulamentadora: string;
  status: string;
  tempoRetencao: number;
  idDocumentos: number[];
  quantidadeDocumentos: number;
  dataExpiracao: Date | null;
}

export function DocumentTypes() {
  const { user } = useAuth();
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const [formModalShow, setFormModalShow] = useState(false);
  const [formEditModalShow, setFormEditModalShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [toastShow, setToastShow] = useState(false);
  const [toastText, setToastText] = useState<string[]>([]);
  const [item, setItem] = useState({} as dataDocumetationType);
  const [data, setData] = useState([]);

  const typesDefault = [
    "contrato",
    "relatório financeiro",
    "ata de reunião",
    "nota fiscal",
    "proposta comercial",
    "relatório técnico",
    "memorando",
    "laudo pericial",
    "atestado",
    "contrato de trabalho",
    "declaração",
    "declaração e atestado",
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setTotalPerPage] = useState(5);

  // Pagination - Get Current Posts
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination - change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setLoadingScreen(true);
    const loadData = async () => {
      const { data } = await api.get("/tiposdocumentais");
      data.map((item: any) => {
        item.status = item.status == true ? "Ativo" : "Inativo";
      });
      data.sort((itemA: any, itemB: any) => itemA.id - itemB.id);
      setData(data);
    };

    loadData();

    setTimeout(() => {
      setLoadingScreen(false);
    }, 500);
  }, []);

  const handleDelete = async (id: number) => {
    setLoadingScreen(true);
    await api
      .delete(`/tiposdocumentais/${id}`)
      .then(async () => {
        setToastText([
          "success",
          "O Guardável",
          "Tipo Documental excluído com sucesso!",
        ]);
        setLoadingScreen(false);
        setToastShow(true);
        const { data } = await api.get("/tiposdocumentais");
        data.map((item: any) => {
          item.status = item.status == true ? "Ativo" : "Inativo";
        });
        data.sort((itemA: any, itemB: any) => itemA.id - itemB.id);
        setData(data);
      })
      .catch((err) => {
        setToastText([
          "danger",
          "O Guardável",
          `Tipo Documental não foi excluído!, ${err?.response?.data?.message}`,
        ]);
        setLoadingScreen(false);
        setToastShow(true);
      });
  };

  const handleSubmit = async (values: FormDataDocumentTypes) => {
    setLoadingButton(true);

    const data = {
      nomeDocumento: values.description,
      leiRegulamentadora: values.regulatoryLaw,
      tempoRetencao: values.retentionPeriod,
      status: values.status === "Ativo" ? true : false,
    };

    await api
      .post(`/tiposdocumentais/${user?.id}`, data)
      .then(async () => {
        setToastText([
          "success",
          "O Guardião",
          "Tipo Documental cadastrado com sucesso!",
        ]);
        setLoadingButton(false);
        setFormModalShow(false);
        setToastShow(true);
        const { data } = await api.get("/tiposdocumentais");
        data.map((item: any) => {
          item.status = item.status == true ? "Ativo" : "Inativo";
        });
        data.sort((itemA: any, itemB: any) => itemA.id - itemB.id);
        setData(data);
      })
      .catch((err) => {
        setToastText([
          "danger",
          "O Guardião",
          `Tipo Documental não foi cadastrado! ${err?.response?.data?.message}`,
        ]);
        setLoadingButton(false);
        setToastShow(true);
      });
  };

  const handleEditSubmit = async (values: FormDataDocumentTypes) => {
    setLoadingButton(true);

    const data = {
      id: item.id,
      nomeDocumento: values.description,
      leiRegulamentadora: values.regulatoryLaw,
      tempoRetencao: values.retentionPeriod,
      status: values.status === "Ativo" ? true : false,
    };

    await api
      .post(`/tiposdocumentais/${user?.id}`, data)
      .then(async () => {
        setToastText([
          "success",
          "O Guardião",
          "Tipo Documental editado com sucesso!",
        ]);
        setLoadingButton(false);
        setFormEditModalShow(false);
        setToastShow(true);
        const { data } = await api.get("/tiposdocumentais");
        data.map((item: any) => {
          item.status = item.status == true ? "Ativo" : "Inativo";
        });
        data.sort((itemA: any, itemB: any) => itemA.id - itemB.id);
        setData(data);
      })
      .catch((err) => {
        setToastText([
          "danger",
          "O Guardião",
          `Tipo Documental não foi editado! ${err?.response?.data?.message}`,
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
      <div className="container">
        <div className="header">
          <h1>
            <span data-testid="title" className="poppins-bold">
              Tipos Documentais
            </span>
          </h1>
          {user?.admin && (
            <Button
              data-testid="button-add"
              onClick={() => setFormModalShow(true)}
              className="button-home justify-content-center align-items-center"
              style={{ fontSize: "1.2rem" }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          )}
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
            <Spinner
              data-testid="spinner"
              animation="border"
              variant="primary"
            />
          </div>
        ) : (
          <>
            <div className="table">
              {data.length === 0 ? (
                <h6>Nenhum Tipo Documental Cadastrado</h6>
              ) : (
                <div>
                  <div
                    style={{
                      minHeight: "46vh",
                    }}
                  >
                    <Table responsive="sm" data-testid="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Descrição</th>
                          <th>Lei Regulamentadora</th>
                          <th>Tempo de Vigência</th>
                          <th>Status</th>
                          {user?.admin && <th>Ações</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item: dataDocumetationType) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nomeDocumento}</td>
                            <td>{item.leiRegulamentadora}</td>
                            <td>{`${item.tempoRetencao} ${
                              item.tempoRetencao === 1 ? "ano" : "anos"
                            }`}</td>
                            <td>
                              {item.status === "Ativo" ? (
                                <Badge bg="success">{"Ativo"}</Badge>
                              ) : (
                                <Badge bg="danger">{"Inativo"}</Badge>
                              )}
                            </td>
                            <td>
                              {user?.admin && (
                                <>
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
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={data.length}
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
                          controlId="description"
                        >
                          <Form.Label>Descrição</Form.Label>
                          <Form.Control
                            type="text"
                            name="description"
                            autoFocus
                            value={values.description}
                            onChange={handleChange}
                            isInvalid={
                              touched.description && !!errors.description
                            }
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
                            isInvalid={
                              touched.regulatoryLaw && !!errors.regulatoryLaw
                            }
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
                              isInvalid={
                                touched.retentionPeriod &&
                                !!errors.retentionPeriod
                              }
                              min={1}
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
                            isInvalid={touched.status && !!errors.status}
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
            )}

            {formEditModalShow && (
              <Modal
                show={formEditModalShow}
                onHide={() => setFormEditModalShow(false)}
                size="md"
                aria-labelledby="contained-edit-modal-title-vcenter"
                centered
              >
                <Modal.Header
                  closeButton
                  style={{ backgroundColor: "#5669db", color: "#fff" }}
                >
                  <Modal.Title id="contained-edit-modal-title-vcenter">
                    Editar Tipo Documental
                  </Modal.Title>
                </Modal.Header>
                <Formik
                  validationSchema={schema}
                  onSubmit={handleEditSubmit}
                  initialValues={{
                    description: item.nomeDocumento,
                    regulatoryLaw: item.leiRegulamentadora,
                    retentionPeriod: Number(
                      item.tempoRetencao.toString().split(" ")[0]
                    ),
                    status: item.status,
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
                        {!typesDefault.includes(
                          item.nomeDocumento.toLowerCase()
                        ) && (
                          <>
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
                                isInvalid={
                                  touched.description && !!errors.description
                                }
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
                                isInvalid={
                                  touched.regulatoryLaw &&
                                  !!errors.regulatoryLaw
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.regulatoryLaw}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group
                              className="mb-3"
                              controlId="editForm.ControlInput1"
                            >
                              <Form.Label>Tempo de Vigência</Form.Label>
                              <InputGroup className="mb-3">
                                <Form.Control
                                  type="number"
                                  placeholder="Digite um número"
                                  name="retentionPeriod"
                                  value={values.retentionPeriod}
                                  onChange={handleChange}
                                  isInvalid={
                                    touched.retentionPeriod &&
                                    !!errors.retentionPeriod
                                  }
                                  min={1}
                                />
                                <InputGroup.Text id="basic-addon2">
                                  {values.retentionPeriod === 1
                                    ? "ano"
                                    : "anos"}
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                  {errors.retentionPeriod}
                                </Form.Control.Feedback>
                              </InputGroup>
                            </Form.Group>
                          </>
                        )}

                        <Form.Group controlId="formEditSelect" className="mb-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            aria-label="Status"
                            name="status"
                            value={values.status}
                            onChange={handleChange}
                            isInvalid={touched.status && !!errors.status}
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
                header={`Tipo de Documento: ${item.nomeDocumento}`}
                message="Tem certeza que deseja excluir esse tipo de documento?"
                messageButton="Excluir"
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
