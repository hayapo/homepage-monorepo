// https://github.com/azukiazusa1/sapper-blog-app/blob/main/app/src/utils/darkTheme.ts
export type Theme = "system" | "light" | "dark";

export const getTheme = (): Theme => {
	if (!("theme" in localStorage)) {
		return "system";
	} else if (localStorage.theme === "light") {
		return "light";
	} else if (localStorage.theme === "dark") {
		return "dark";
	} else {
		return "system";
	}
};

export const changeTheme = (value: Theme) => {
	switch (value) {
		case "system":
			localStorage.setItem("theme", "system");
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
		case "dark":
			localStorage.setItem("theme", "dark");
			document.documentElement.classList.add("dark");
			break;
		case "light":
			localStorage.setItem("theme", "light");
			document.documentElement.classList.remove("dark");
			break;
	}
};
