import React from "react";
import ReactDom from 'react-dom';
import { render, screen } from "@testing-library/react";
import Drobdown from "../dropdown";

// test("renders learn react link", () => {
//   render(<Drobdown list={[]} selectedItem={""} setSelectedItem="" />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

it("renders without crashing" , () =>{
  const div = document.createElement('div')
  ReactDom.render(<Drobdown list={[]} selectedItem={""} setSelectedItem={""} />, div);
})