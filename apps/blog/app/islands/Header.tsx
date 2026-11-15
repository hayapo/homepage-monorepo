import { useRequestContext } from "hono/jsx-renderer";
import { blogUrl } from "../lib/url";

export const Header = () => {
	const blogTitle = "hayapo.log()";
	const c = useRequestContext();
	const isHome =
		c.req.path.replace(/\/$/, "") === blogUrl("/").replace(/\/$/, "");
	return (
		<header class="fixed inset-x-0 top-0 z-50 col-span-12 h-(--header-height) bg-background">
			<div class="h-(--header-height) max-w-(--max-width) mx-auto flex justify-between items-center px-4">
				{isHome ? (
					<h1 class="text-(length:--header-font-size) font-(--header-font-weight) font-mono">
						{blogTitle}
					</h1>
				) : (
					<a
						href={blogUrl("/")}
						class="relative inline-block text-(length:--header-font-size) font-(--header-font-weight) rounded-sm font-mono md:after:absolute md:after:inset-x-0 md:after:bottom-0 md:after:h-0.5 md:after:origin-left md:after:scale-x-0 md:after:bg-green-6 md:after:transition-transform md:after:duration-300 md:hover:after:scale-x-100"
					>
						{blogTitle}
					</a>
				)}
			</div>
		</header>
	);
};
