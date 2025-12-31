import { useCallback, useEffect, useState } from "hono/jsx";
import { changeTheme, getTheme, type Theme } from "../../util/theme";
import { ArrowDown } from "../Icons/ArrowDown";
import { Check } from "../Icons/Check";
import { Computer } from "../Icons/Computer";
import { Moon } from "../Icons/Moon";
import { Sun } from "../Icons/Sun";

export const ThemeSwitcher = () => {
	const items = [
		{ value: "system", label: "System" },
		{ value: "light", label: "Light" },
		{ value: "dark", label: "Dark" },
	] as const satisfies readonly {
		value: Theme;
		label: string;
	}[];

	const [theme, setTheme] = useState<Theme | null>(null);

	useEffect(() => {
		// コンポーネントがマウントされた後に localStorage からテーマを取得
		setTheme(getTheme());
	}, []);

	const handleClick = useCallback(
		(t: Theme) => {
			setTheme(t);
			changeTheme(t);
		},
		[setTheme, changeTheme],
	);

	return (
		<div className="dropdown">
			<button tabIndex={0} type="button" className="btn m-1 px-2">
				<Sun class="dark:hidden" />
				<Moon class="hidden dark:block" />
				<ArrowDown />
			</button>
			{/* biome-ignore lint: noNoninteractiveTabindex */}
			<ul
				tabIndex={0}
				className="dropdown-content rounded-box z-1 p-2 shadow-2xl w-fit bg-base-300"
			>
				{items.map((item) => {
					return (
						<li class="flex flex-row gap-2 justify-between">
							<button
								type="button"
								name="theme-dropdown"
								class="theme-controller btn btn-sm btn-ghost justify-start w-32"
								aria-label={item.label}
								value={item.value}
								onClick={() => handleClick(item.value)}
							>
								<div class="flex flex-row items-center gap-2">
									<ConditionalThemeIcon theme={item.value} />
									<span>{item.label}</span>
								</div>
								<div class=" ml-auto">
									{theme === item.value && <Check class="size-5" />}
								</div>
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

const ConditionalThemeIcon = ({ theme }: { theme: Theme }) => {
	switch (theme) {
		case "system":
			return <Computer class="size-5" />;
		case "light":
			return <Sun class="size-5" />;
		case "dark":
			return <Moon class="size-5" />;
	}
};
