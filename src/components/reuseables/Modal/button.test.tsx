import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "./modal";

jest.mock("../spinner", () => () => <div data-testid="spinner">Loading...</div>);

describe("Modal Component", () => {
  test("renders the message", () => {
    render(<Modal message="Submit?" loading={false} onPress={() => {}} closeModal={() => {}} />);

    expect(screen.getByText("Submit?")).toBeInTheDocument();
  });

  test("calls onPress when confirmed", () => {
    const onPress = jest.fn();
    render(<Modal message="Submit?" loading={false} onPress={onPress} closeModal={() => {}} />);

    fireEvent.click(screen.getByText("Yes, submit"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("calls closeModal with false when cancelled", () => {
    const closeModal = jest.fn();
    render(<Modal message="Submit?" loading={false} onPress={() => {}} closeModal={closeModal} />);

    fireEvent.click(screen.getByText("Go back"));

    expect(closeModal).toHaveBeenCalledWith(false);
  });

  test("shows a spinner and hides actions while loading", () => {
    render(<Modal message="Submit?" loading={true} onPress={() => {}} closeModal={() => {}} />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByText("Yes, submit")).not.toBeInTheDocument();
  });
});
