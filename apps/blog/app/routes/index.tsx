import { createRoute } from "honox/factory";
import { getEntries } from "../lib/entries";

export default createRoute((c) => {
	const entries = getEntries();
	return c.render(
		<div>
			<h1>Blog Top Page</h1>
			<p>ブログのトップページだよ</p>
			{entries.map((entry) => {
				return (
					<li key={entry.id}>
						<a href={`/entry/${entry.id}`}>{entry.frontmatter.title}</a>
					</li>
				);
			})}
		</div>,
	);
});
