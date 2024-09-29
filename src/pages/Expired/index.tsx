import { useEffect, useState } from "react";
import { NavBar } from "../../components";
import {
  Button,
  Modal,
  Spinner,
  Table,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { dataType } from "../Documents";
import { dataDocumetationType } from "../DocumentTypes";
import api from "../../services/api";
import { format, parseISO } from "date-fns";

import Logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "../../components/Pagination";
import { ModalComponent } from "../../components/Modal";
import { useNavigate } from "react-router-dom";

export function Expired() {
  const navigate = useNavigate();
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [dataDocumentsExpired, setDataDocumentsExpired] = useState([]);
  const [dataDocumentationTypes, setDataDocumentationTypes] = useState([]);
  const [item, setItem] = useState({} as dataType);
  const [modalShow, setModalShow] = useState(false);
  const [selectedModalShow, setSelectedModalShow] = useState(false);

  // toast
  const [toastShow, setToastShow] = useState(false);
  const [toastText, setToastText] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setTotalPerPage] = useState(5);

  // Pagination - Get Current Posts
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataDocumentsExpired.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Pagination - change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // selected rows
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleRowClick = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAllClick = () => {
    if (selectedRows.length === dataDocumentsExpired.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(dataDocumentsExpired.map((item: dataType) => item.id));
    }
  };

  const isSelected = (id: number) => selectedRows.includes(id);

  useEffect(() => {
    setLoadingScreen(true);
    const loadDataDocumentsExpired = async () => {
      const { data } = await api.get("/documentos/expirados");
      data.sort((itemA: any, itemB: any) => itemA.id - itemB.id);
      setDataDocumentsExpired(data);
    };

    const loadDataDocumentationTypes = async () => {
      const { data } = await api.get("/tiposdocumentais");
      setDataDocumentationTypes(data);
    };

    loadDataDocumentsExpired();
    loadDataDocumentationTypes();

    setTimeout(() => {
      setLoadingScreen(false);
    }, 500);
  }, []);

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
        const { data } = await api.get("/documentos/expirados");
        data.sort((itemA: any, itemB: any) => itemA.id - itemB.id);

        setDataDocumentsExpired(data);
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

  const handleDeleteSelected = async () => {
    setLoadingScreen(true);
    await api
      .delete(`/documentos/excluirdocumentos`, { data: selectedRows })
      .then(async () => {
        setToastText([
          "success",
          "O Guardável",
          "Documentos excluídos com sucesso!",
        ]);
        setLoadingScreen(false);
        setToastShow(true);
        const { data } = await api.get("/documentos/expirados");
        data.sort((itemA: any, itemB: any) => itemA.id - itemB.id);

        setDataDocumentsExpired(data);
      })
      .catch((err) => {
        setToastText([
          "danger",
          "O Guardável",
          `Documentos não foram excluídos!, ${err}`,
        ]);
        setLoadingScreen(false);
        setToastShow(true);
      })
      .finally(() => {
        setSelectedRows([]);
      });
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
      <div className="container">
        <div className="header">
          <h1>
            <span className="poppins-bold">Documentos Expirados</span>
          </h1>
          <div>
            {selectedRows.length > 0 && (
              <Button
                className="button-home justify-content-center align-items-center"
                style={{
                  fontSize: "1.2rem",
                  border: "none",
                  marginLeft: "1rem",
                  background: "var(--red) !important",
                  transitionDuration: "0.5s",
                  transition: "all ease-in-out",
                }}
                onClick={() => setSelectedModalShow(true)}
              >
                <FontAwesomeIcon icon={faTrash} />
                <span style={{ marginLeft: "0.5rem", fontSize: ".9rem" }}>
                  Excluir itens selecionados
                </span>
              </Button>
            )}
            <Button
              className="button-home justify-content-center align-items-center"
              style={{
                fontSize: "1.2rem",
                border: "none",
                marginLeft: "1rem",
                background: "var(--purple)",
                width: "2.5rem",
              }}
              onClick={() => navigate("/documentos")}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
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
              {dataDocumentsExpired.length === 0 ? (
                <h6>Nenhum Documento Expirado</h6>
              ) : (
                <div>
                  <div
                    style={{
                      minHeight: "46vh",
                    }}
                  >
                    <Button
                      variant="primary"
                      onClick={handleSelectAllClick}
                      className="mb-3"
                    >
                      {selectedRows.length === dataDocumentsExpired.length
                        ? "Deselecionar tudo"
                        : "Selecionar tudo"}
                    </Button>
                    <Table responsive="sm">
                      <thead>
                        <tr>
                          <th></th>
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
                              <td>
                                <input
                                  type="checkbox"
                                  checked={isSelected(item.id)}
                                  onChange={() => handleRowClick(item.id)}
                                  style={{ cursor: "pointer" }}
                                />
                              </td>
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
                    totalItems={dataDocumentsExpired.length}
                    paginate={paginate}
                  />
                </div>
              )}
            </div>

            {modalShow && (
              <ModalComponent
                show={modalShow}
                setShow={setModalShow}
                item={item}
                handleDelete={handleDelete}
                header={`Excluir Documento: ${item.nomeDocumento}`}
                message="Tem certeza que deseja excluir esse documento?"
                messageButton="Excluir"
              />
            )}

            {selectedModalShow && (
              <Modal
                show={selectedModalShow}
                onHide={() => setSelectedModalShow(false)}
                centered
              >
                <Modal.Header
                  closeButton
                  style={{ backgroundColor: "#5669db", color: "#fff" }}
                >
                  <Modal.Title>
                    <h6>Excluir itens selecionados</h6>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Tem certeza que deseja excluir todos os itens selecionados?
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedModalShow(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant={"danger"}
                    onClick={() => {
                      setSelectedModalShow(false);
                      handleDeleteSelected();
                    }}
                  >
                    Excluir
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </>
        )}
      </div>
    </>
  );
}
