import { Entry } from "../../lib/entries";

type Props = {
  entry: Entry;
};

export async function EntryListItem({ entry }: Props) {
  return (
    <section className="flex items-center gap-2">
      <time className="text-[1em] italic text-secondary">{entry.frontmatter.publishedAt}</time>
      <a href={`/entries/${entry.id}/`} className="hover:bg-green-a6 rounded-sm text-[1.3em] font-bold">
        {entry.frontmatter.title}
      </a>
    </section>
  );
}
