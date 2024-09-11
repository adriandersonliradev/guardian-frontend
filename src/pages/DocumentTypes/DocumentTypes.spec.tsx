import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { DocumentTypes } from ".";
import api from "../../services/api";
import "@testing-library/jest-dom";

// Mock do axios
vi.mock("../../services/api");

// Dados de teste
const mockData = [
  {
    id: 1,
    nomeDocumento: "Documento 1",
    leiRegulamentadora: "Lei 1",
    tempoRetencao: 1,
    status: "Ativo",
  },
];

// Teste de renderização básica
describe("DocumentTypes", () => {
  beforeEach(() => {
    // Reseta o mock do axios antes de cada teste
    vi.clearAllMocks();
  });

  it("deve renderizar corretamente", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    render(<DocumentTypes />);

    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("button-add")).toBeInTheDocument();
  });

  it("deve mostrar spinner durante carregamento", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    render(<DocumentTypes />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  // it("deve adicionar um novo tipo documental", async () => {
  //   (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });
  //   (api.post as jest.Mock).mockResolvedValueOnce({});
  //   (api.get as jest.Mock).mockResolvedValueOnce({
  //     data: [
  //       ...mockData,
  //       {
  //         id: 2,
  //         nomeDocumento: "Documento 2",
  //         leiRegulamentadora: "Lei 2",
  //         tempoRetencao: 2,
  //         status: "Inativo",
  //       },
  //     ],
  //   });

  //   render(<DocumentTypes />);

  //   await waitFor(() => {
  //     expect(screen.getByTestId("table")).toBeInTheDocument();
  //   });

  //   userEvent.click(screen.getByTestId("button-add"));

  //   userEvent.type(screen.getByLabelText(/descrição/i), "Documento 2");
  //   userEvent.type(screen.getByLabelText(/lei regulamentadora/i), "Lei 2");
  //   userEvent.type(screen.getByLabelText(/tempo de vigência/i), "2");
  //   userEvent.selectOptions(screen.getByLabelText(/status/i), "Inativo");

  //   userEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

  //   await waitFor(() => {
  //     expect(api.post).toHaveBeenCalled();
  //     expect(
  //       screen.getByText("Tipo Documental cadastrado com sucesso!")
  //     ).toBeInTheDocument();
  //   });
  // });

  // it("deve excluir um tipo documental", async () => {
  //   (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });
  //   (api.delete as jest.Mock).mockResolvedValueOnce({});
  //   (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

  //   render(<DocumentTypes />);

  //   // Simular a exclusão
  //   userEvent.click(screen.getByRole("button", { name: /excluir/i }));

  //   await waitFor(() => {
  //     expect(api.delete).toHaveBeenCalled();
  //     expect(screen.queryByText("Documento 1")).not.toBeInTheDocument();
  //   });
  // });
});
