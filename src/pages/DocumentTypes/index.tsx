import { Button, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { NavBar } from "../../components";
import { useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";

interface FormDataDocumentTypes {
  description: string;
  regulatoryLaw: string;
  retentionPeriod: number;
  status: string;
}

export function DocumentTypes() {
  const [modalShow, setModalShow] = useState(false);

  const handleSubmit = (values: FormDataDocumentTypes) => {
    console.log(values);
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
      <NavBar />
      <div className="container">
        <div className="header">
          <h1>
            <span className="poppins-bold">Tipos Documentais</span>
          </h1>
          <Button
            onClick={() => setModalShow(true)}
            className="button-home"
            style={{ fontSize: "1.2rem" }}
          >
            +
          </Button>
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
                <Form.Group as={Col} className="mb-3" controlId="description">
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
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.status}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit">Cadastrar</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
