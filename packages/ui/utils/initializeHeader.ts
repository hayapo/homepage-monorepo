import React from "react";
import { type Root, createRoot } from "react-dom/client";
import { Header } from "../components/Header";
import { HEADER_MOUNT_EVENT, HEADER_UNMOUNT_EVENT } from "../constants";

let isInitialized = false;
const activeRoots = new Map<string, Root>();

export const initializeHeader = () => {
	if (isInitialized) return;
	if (typeof window === "undefined") return;

	document.addEventListener(HEADER_MOUNT_EVENT, (e: Event) => {
		const { id } = (e as CustomEvent).detail;

		if (activeRoots.has(id)) return;

		const targetElement = document.getElementById(id);
		if (!targetElement) return;

		const root = createRoot(targetElement);
		root.render(React.createElement(Header));
		activeRoots.set(id, root);
	});

	document.addEventListener(HEADER_UNMOUNT_EVENT, (e: Event) => {
		const { id } = (e as CustomEvent).detail;
		const root = activeRoots.get(id);
		if (root) {
			root.unmount();
			activeRoots.delete(id);
		}
	});

	isInitialized = true;
	console.log("UI: Header listeners initialized.");
};
