import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { getEntries, getEntryByEntryName } from "../../lib/entries";

export default createRoute(
	ssgParams(() =>
		getEntries().map((entry) => ({
			slug: entry.id,
		})),
	),
	async (c) => {
		const slug = c.req.param("slug");
		const entry = getEntryByEntryName(slug);
		if (!entry) {
			return c.render(<h2>記事が見つからないよ &gt;&lt; </h2>);
		}
		return c.render(
			<article className="article">{entry.Component({})}</article>,
		);
	},
);
