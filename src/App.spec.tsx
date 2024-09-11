import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "./App";
import "@testing-library/jest-dom";

vi.mock("./pages/Home", () => ({
  Home: () => <div>Home Page</div>,
}));
vi.mock("./pages/DocumentTypes", () => ({
  DocumentTypes: () => <div>Document Types Page</div>,
}));
vi.mock("./pages/AboutUs", () => ({
  AboutUs: () => <div>About Us Page</div>,
}));
vi.mock("./pages/Documents", () => ({
  Documents: () => <div>Documents Page</div>,
}));

describe("App Routing", () => {
  it("should render Home component for the default route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
  });

  it("should render DocumentTypes component for /tipos-documentais route", () => {
    render(
      <MemoryRouter initialEntries={["/tipos-documentais"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Document Types Page/i)).toBeInTheDocument();
  });

  it("should render Documents component for /documentos route", () => {
    render(
      <MemoryRouter initialEntries={["/documentos"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Documents Page/i)).toBeInTheDocument();
  });

  it("should render AboutUs component for /sobre-nos route", () => {
    render(
      <MemoryRouter initialEntries={["/sobre-nos"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/About Us Page/i)).toBeInTheDocument();
  });
});
