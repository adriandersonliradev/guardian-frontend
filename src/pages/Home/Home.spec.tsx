import { render } from "@testing-library/react";
import { Home } from ".";

describe("AboutUs", () => {
  it("should render correctly", () => {
    const wrapper = render(<Home />);

    expect(wrapper).toMatchSnapshot();
  });
});
