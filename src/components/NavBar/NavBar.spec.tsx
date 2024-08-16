import { render } from "@testing-library/react";
import NavBar from ".";

describe("NavBar", () => {
  it("should render correctly", () => {
    const wrapper = render(<NavBar />);

    expect(wrapper).toMatchSnapshot();
  });
});
