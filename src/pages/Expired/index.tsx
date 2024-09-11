import { useEffect, useState } from "react";
import { NavBar } from "../../components";
import { Button, Spinner, Table } from "react-bootstrap";
import { dataType } from "../Documents";
import { dataDocumetationType } from "../DocumentTypes";
import api from "../../services/api";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Expired() {
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [dataDocumentsExpired, setDataDocumentsExpired] = useState([]);
  const [dataDocumentationTypes, setDataDocumentationTypes] = useState([]);

  useEffect(() => {
    setLoadingScreen(true);
    const loadDataDocumentsExpired = async () => {
      const { data } = await api.get("/documentos/expirados");
      setDataDocumentsExpired(data);
    };

    const loadDataDocumentationTypes = async () => {
      const { data } = await api.get("/tiposdocumentais");
      setDataDocumentationTypes(data);
    };

    // loadDataDocumentsExpired();
    loadDataDocumentationTypes();

    setTimeout(() => {
      setLoadingScreen(false);
    }, 1500);
  }, []);

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="header">
          <h1>
            <span className="poppins-bold">Documentos Expirados</span>
          </h1>
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
                      {dataDocumentsExpired.map((item: dataType) => {
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
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
