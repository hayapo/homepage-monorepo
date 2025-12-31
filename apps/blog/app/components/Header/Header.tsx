import { ThemeSwitcher } from "./_ThemeSwitcher.island";

export const Header = () => {
	return (
		<header className="navbar bg-base-100 p-0">
			<div className="flex w-screen max-w-4xl mx-auto items-center">
				<div className="flex-1">
					<a href="/" className="btn btn-ghost text-xl p-2">
						hayapo blog
					</a>
				</div>
				<div className="flex-none">
					<ThemeSwitcher />
				</div>
			</div>
		</header>
	);
};
