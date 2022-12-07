import React from "react";

import { render, cleanup , waitForElement, fireEvent , getByText , prettyDOM , getAllByTestId, getByAltText, getByPlaceholderText, queryByText}  from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    })
  });

  it("Loads data, books an interview, and reduces the spots remaining for the first day by 1", async() => {
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"))

    const nameBox = getByPlaceholderText(appointment, "Enter Student Name");
    fireEvent.change(nameBox, {
      target: { value: "Lydia Miller-Jones" }
    });
    
    const instructor1 = getByAltText(appointment, "Sylvia Palmer")
    fireEvent.click(instructor1)

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    expect(getByAltText(appointment, "Edit")).toBeInTheDocument();
    expect(getByAltText(appointment, "Delete")).toBeInTheDocument();

    
    const getMonday = (getAllByTestId(container, "day"))[0]
    expect(getByText(getMonday, "no spots remaining")).toBeInTheDocument();

  });

  it("cancel active interview, check if number of spots increases", async () => {

    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(apps => queryByText(apps,"Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"))
    expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"))
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"))
    
    const getMonday = (getAllByTestId(container, "day")).find(day => getByText(day, "Monday"));
    expect(getByText(getMonday, "2 spots remaining")).toBeInTheDocument();
   
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    const {container, debug} = render(<Application/>);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(apps => queryByText(apps,"Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: {value: "Kiko Ocampo"} 
    })

    expect(getByPlaceholderText(appointment, "Enter Student Name")).toHaveValue("Kiko Ocampo")

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    fireEvent.click(getByText(appointment,"Save"))
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Kiko Ocampo"))

    const getMonday = (getAllByTestId(container, "day")).find(day => getByText(day, "Monday"));
    expect(getByText(getMonday, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const {container, debug} = render(<Application/>);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(apps => queryByText(apps,"Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: {value: "Kiko Ocampo"} 
    })

    expect(getByPlaceholderText(appointment, "Enter Student Name")).toHaveValue("Kiko Ocampo")

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    fireEvent.click(getByText(appointment,"Save"))
    await waitForElement(() => getByText(appointment, "Error"));
    fireEvent.click(getByAltText(appointment, "Close"))
    expect(getByPlaceholderText(appointment, "Enter Student Name")).toHaveValue("Archie Cohen")
    fireEvent.click(getByText(appointment, "Cancel"))
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();

  });

  it("shows the delete error when trying to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const {container, debug} = render(<Application/>);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(apps => queryByText(apps,"Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"))
    await waitForElement(() => getByText(appointment, "Error"));
    fireEvent.click(getByAltText(appointment, "Close"))
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
  });

});


