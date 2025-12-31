const mediaQueryListener = (e: MediaQueryListEvent) => {
	if (localStorage.theme === "system") {
		if (e.matches) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}
};

const initTheme = () => {
	if (!("theme" in localStorage) || localStorage.theme === "system") {
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			document.documentElement.classList.add("dark");
		}
		localStorage.theme = "system";
	} else if (localStorage.theme === "dark") {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
};

initTheme();
window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", mediaQueryListener);
