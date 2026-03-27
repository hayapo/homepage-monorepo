import { createRoute } from "honox/factory";
import { getEntries } from "../lib/entries";

export default createRoute((c) => {
  const entries = getEntries();
  return c.render(
    <div>
      <p>ブログのトップページだよ</p>
      {entries.map((entry) => {
        return (
          <li key={entry.id} class="list-none my-5">
            <a href={`/entries/${entry.id}`} class="hover:underline hover:text-green-8">
              {entry.frontmatter.title}
            </a>
          </li>
        );
      })}
    </div>,
  );
});
