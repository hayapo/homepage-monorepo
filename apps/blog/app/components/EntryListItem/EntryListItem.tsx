import type { Entry } from '../../lib/entries';
import { blogUrl } from '../../lib/url';

type Props = {
	entry: Entry;
};

export async function EntryListItem({ entry }: Props) {
	return (
		<section
			id={entry.id}
			className="flex flex-col items-start gap-1 md:flex-row md:items-center md:border-none md:bg-inherit md:gap-2 md:rounded-none"
		>
			<time className="text-[0.3em] md:text-[0.9em] italic text-secondary">{entry.frontmatter.publishedAt}</time>
			<a href={blogUrl(`/entries/${entry.id}/`)} className="text-[0.7em] font-bold md:text-[1.0em] md:hover:text-hover">
				{entry.frontmatter.title}
			</a>
		</section>
	);
}
