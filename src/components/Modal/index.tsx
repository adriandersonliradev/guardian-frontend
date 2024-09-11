import { Dispatch, SetStateAction } from "react";
import { Button, Modal } from "react-bootstrap";
import { dataDocumetationType } from "../../pages/DocumentTypes";
import { dataType } from "../../pages/Documents";

interface ModalComponentProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  item: dataDocumetationType | dataType;
  handleDelete: (id: number) => void;
  header: string;
  message: string;
  messageButton: string;
}

export function ModalComponent({
  show,
  setShow,
  item,
  handleDelete,
  header,
  message,
  messageButton,
}: ModalComponentProps) {
  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#5669db", color: "#fff" }}
        >
          <Modal.Title>
            <h6>{header}</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancelar
          </Button>
          <Button
            variant={messageButton === "Excluir" ? "danger" : "success"}
            onClick={() => {
              setShow(false);
              handleDelete(item.id);
            }}
          >
            {messageButton}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
