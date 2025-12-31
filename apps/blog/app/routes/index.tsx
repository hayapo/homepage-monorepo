import { createRoute } from "honox/factory";
import { getEntries } from "../lib/entries";

export default createRoute((c) => {
	const entries = getEntries();
	// console.log(entries)
	return c.render(
		<div>
			<h1>Blog Top Page</h1>
			<p>ブログのトップページだよ</p>
			{entries.map((entry) => {
				return (
					<li>
						<a href={`/entry/${entry.id}`}>{entry.frontmatter.title}</a>
					</li>
				);
			})}
		</div>,
	);
});
