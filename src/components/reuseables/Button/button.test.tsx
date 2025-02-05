import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./button";
import Spinner from "../spinner"; // Mock the Spinner component

jest.mock("../spinner", () => () => <div data-testid="spinner">Loading...</div>);

describe("Button Component", () => {
  test("renders button with correct title", () => {
    render(<Button title="Click Me" onPress={() => {}} />);
    
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("calls onPress when button is clicked", () => {
    const handleClick = jest.fn(); // Mock function
    render(<Button title="Click Me" onPress={handleClick} />);

    fireEvent.click(screen.getByText("Click Me")); // Simulate click

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("shows a spinner when loading is true", () => {
    render(<Button title="Click Me" onPress={() => {}} loading={true} />);
    
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByText("Click Me")).not.toBeInTheDocument();
  });

  test("does not call onPress when loading is true", () => {
    const handleClick = jest.fn();
    render(<Button title="Click Me" onPress={handleClick} loading={true} />);

    fireEvent.click(screen.getByTestId("spinner")); // Try clicking spinner

    expect(handleClick).not.toHaveBeenCalled();
  });
});
