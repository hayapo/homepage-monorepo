import type { JSX } from "hono/jsx/jsx-runtime";
import type { MDXProps } from "mdx/types";

export type Frontmatter = {
	title: string;
	description: string;
	tags?: string[];
	publishedAt: string;
	updatedAt?: string;
	coverImage?: string;
};

type MDX = {
	frontmatter: Frontmatter;
	default: (props: MDXProps) => JSX.Element;
};

const entries = import.meta.glob<MDX>("../entries/**/*.mdx", {
	eager: true,
});

const sortByPublishedAtDesc = ():
	| ((a: [path: string, mdx: MDX], b: [path: string, mdx: MDX]) => number)
	| undefined => {
	return ([_aPath, aEntry], [_bPath, bEntry]) => {
		return (
			new Date(bEntry.frontmatter.publishedAt).getTime() -
			new Date(aEntry.frontmatter.publishedAt).getTime()
		);
	};
};

export const getEntries = () => {
	const entriesData = Object.entries(entries)
		.sort(sortByPublishedAtDesc())
		.map(([path, entry]) => {
			return {
				id: path.replace(/^\.\.\/entries\//, "").replace(/\/index\.mdx$/, ""),
				frontmatter: entry.frontmatter,
				Component: entry.default,
			};
		});
	return entriesData;
};

export const getEntryByEntryName = (entryName: string) => {
	const entries = getEntries();
	return entries.find((entry) => entry.id === entryName);
};
