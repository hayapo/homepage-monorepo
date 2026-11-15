import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import ContentTree from "../../../islands/ContentTree";
import { getAllEntries, getEntryByEntryName } from "../../../lib/entries";
import { blogUrl } from "../../../lib/url";

export default createRoute(
	ssgParams(() =>
		getAllEntries().map((entry) => ({
			slug: entry.id,
		})),
	),
	async (c) => {
		const slug = c.req.param("slug");
		if (!slug) return c.notFound();
		const entry = getEntryByEntryName(slug);
		if (!entry) return c.notFound();

		return c.render(
			<div className="relative left-1/2 grid w-[calc(100vw-2rem)] max-w-384 min-w-0 -translate-x-1/2 grid-cols-1 gap-2 md:grid-cols-12 md:gap-0">
				<div className="sticky top-(--header-height) z-40 mx-auto w-full max-w-200 max-h-[calc(100svh-var(--header-height))] bg-background md:mx-0 md:justify-self-end md:bg-inherit md:overflow-hidden md:pr-4 md:w-full md:col-span-3">
					<ContentTree headings={entry.headings} />
				</div>
				<div className="mx-auto w-full max-w-240 min-w-0 md:mx-0 md:col-span-9 md:col-start-4">
					<a
						href={blogUrl("/")}
						className="mb-2 hidden w-fit text-sm text-secondary hover:text-hover sm:block"
					>
						‹ 記事一覧へ
					</a>
					<article className="article min-w-0 pb-8">
						<div className="flex flex-wrap items-baseline gap-x-3 text-secondary font-mono">
							<time className="italic text-[1.1em]">
								{entry.frontmatter.publishedAt}
							</time>
							{entry.frontmatter.updatedAt && (
								<time
									className="text-sm"
									dateTime={entry.frontmatter.updatedAt}
								>
									updated: {entry.frontmatter.updatedAt}
								</time>
							)}
						</div>
						<h1>{entry.frontmatter.title}</h1>
						{entry.Component({})}
					</article>
				</div>
			</div>,
		);
	},
);
