import { render } from "@testing-library/react";
import { AboutUs } from ".";

describe("AboutUs", () => {
  it("should render correctly", () => {
    const wrapper = render(<AboutUs />);

    expect(wrapper).toMatchSnapshot();
  });
});
