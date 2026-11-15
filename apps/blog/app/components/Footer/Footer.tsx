import { blogUrl } from "../../lib/url";

export function Footer() {
	return (
		<footer class="col-span-12 mx-auto mt-12 w-full max-w-(--max-width) px-4 pb-8">
			<div class="flex flex-col gap-3 border-t border-gray-6 pt-4 text-sm text-secondary sm:flex-row sm:items-center sm:justify-between">
				<a
					href={blogUrl("/")}
					class="w-fit text-primary underline decoration-gray-7 underline-offset-4 hover:text-hover"
				>
					hayapo.log()
				</a>
				<p>© {new Date().getFullYear()} hayapo</p>
			</div>
		</footer>
	);
}
