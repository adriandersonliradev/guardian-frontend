import api from "./api"; // ajuste o caminho conforme necessário

describe("API Configuration", () => {
  it("should have the correct baseURL", () => {
    expect(api.defaults.baseURL).toBe("http://localhost:8080");
  });

  it("should have the correct timeout", () => {
    expect(api.defaults.timeout).toBe(5000);
  });

  it("should have the correct Content-Type header", () => {
    expect(api.defaults.headers["Content-Type"]).toBe("application/json");
  });
});
