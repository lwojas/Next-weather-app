// __tests__/index.test.jsx

import { render, screen } from "@testing-library/react";
import Home from "../src/pages/index";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("renders the correct temperature", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: /amsterdam/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
