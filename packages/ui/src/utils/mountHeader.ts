import React from "react";
import { createRoot } from "react-dom/client";
import { Header } from "../components/Header";

export const mountHeader = (element: HTMLElement) => {
	const root = createRoot(element);
	root.render(React.createElement(Header));
};
