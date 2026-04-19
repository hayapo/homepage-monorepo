import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { getAllEntries, getEntryByEntryName } from "../../../lib/entries";
import { Fragment } from "hono/jsx/jsx-runtime";

export default createRoute(
  ssgParams(() =>
    getAllEntries().map((entry) => ({
      slug: entry.id,
    })),
  ),
  async (c) => {
    const slug = c.req.param("slug");
    if (!slug) return;
    const entry = getEntryByEntryName(slug);
    if (!entry) {
      return c.render(<h2>記事が見つからないよ &gt;&lt; </h2>);
    }
    return c.render(
      <Fragment>
        <time className="italic text-[1.1em] text-secondary">{entry.frontmatter.publishedAt}</time>
        <h1>{entry.frontmatter.title}</h1>
        {entry.Component({})}
      </Fragment>,
    );
  },
);
