import type { JSX } from "hono/jsx/jsx-runtime";
import type { MDXProps } from "mdx/types";

export const ENTRIES_PER_PAGE = 15;

const sortByPublishedAtDesc = ():
  | ((a: [path: string, mdx: MDX], b: [path: string, mdx: MDX]) => number)
  | undefined => {
  return ([_aPath, aEntry], [_bPath, bEntry]) => {
    return new Date(bEntry.frontmatter.publishedAt).getTime() - new Date(aEntry.frontmatter.publishedAt).getTime();
  };
};

type MDX = {
  frontmatter: Frontmatter;
  default: (props: MDXProps) => JSX.Element;
};

const entries = import.meta.glob<MDX>("../entries/**/*.mdx", {
  eager: true,
});

export type Frontmatter = {
  title: string;
  description: string;
  tags?: string[];
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
};

export type Entry = {
  id: string;
  frontmatter: Frontmatter;
  Component: (props: MDXProps) => JSX.Element;
};

export type Entries = {
  entries: Entry[];
  hasPrevious: boolean;
  hasNext: boolean;
};

export type PaginationEntries = {
  prev: Entry | null;
  next: Entry | null;
};

export function getAllEntries(): Entry[] {
  return allEntries;
}

const allEntries = _getAllEntries();

function _getAllEntries(): Entry[] {
  const entriesData = Object.entries(entries)
    .filter(([path]) => shouldPublish(path))
    .sort(sortByPublishedAtDesc())
    .map(([path, entry]) => {
      return {
        id: path.replace(/^\.\.\/entries\//, "").replace(/\/index\.mdx$/, ""),
        frontmatter: entry.frontmatter,
        Component: entry.default,
      };
    });
  return entriesData;
}

export function getMaxPageNum(entries: Entry[]): number {
  return Math.ceil(entries.length / ENTRIES_PER_PAGE);
}

export function getEntries(page: number): Entries {
  const start = ENTRIES_PER_PAGE * (page - 1);
  const end = ENTRIES_PER_PAGE * page;
  const entries = getAllEntries();
  const hasPrevious = page > 1;
  const hasNext = end < entries.length;
  return {
    entries: entries.slice(start, end),
    hasPrevious,
    hasNext,
  };
}

export function getPrevAndNextEntries(slug: string): PaginationEntries {
  const allEntries = getAllEntries();
  const currentIndex = allEntries.findIndex((entry) => entry.id === slug);
  const prev = currentIndex > 0 ? allEntries[currentIndex - 1] : null;
  const next = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;
  return {
    prev,
    next,
  };
}

export function getEntryByEntryName(slug: string) {
  const entries = getAllEntries();
  return entries.find((entry) => entry.id === slug);
}

function shouldPublish(path: string): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const slug = path.replace(/^\.\.\/entries\//, "").replace(/\/index\.mdx$/, "");
  return !slug.startsWith("_");
}
