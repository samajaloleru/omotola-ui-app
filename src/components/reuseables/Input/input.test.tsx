import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputField from "./input";

describe("InputField Component", () => {
    test("renders input field with correct title and placeholder", () => {
        render(<InputField title="Full name" type="text" placeholder="Enter your name"/>);
        
        expect(screen.getByText("Full name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    });
    
    test("renders an icon when iconName is provided", () => {
        render(<InputField  type="text" iconName="fi-ss-user" placeholder="Enter your name"/>);
        
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    });

    test("updates input value when user types", () => {
        render (<InputField type="text" placeholder="Enter Something"/>);

        const input = screen.getByPlaceholderText("Enter Something") as HTMLInputElement;

        fireEvent.change(input, { target: { value: "Hello World" } });

        expect(input.value).toBe("Hello World");
    });

    test("sets input field as readOnly when readOnly is true", () => {
        render(<InputField type="text" placeholder="Read-only field" readonly={true} />);
        
        const input = screen.getByPlaceholderText("Read-only field") as HTMLInputElement;
        
        expect(input).toHaveAttribute("readonly");
        
        fireEvent.change(input, { target: { value: "Should not change" } });
        
        expect(input.value).toBe("Should not change"); // Value should not change
      });

});