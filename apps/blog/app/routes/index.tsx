import { createRoute } from "honox/factory";
import { getEntries } from "../lib/entries";
import { EntryListItem } from "../components/EntryListItem/EntryListItem";
import { Fragment } from "hono/jsx/jsx-runtime";
import { Pagination } from "../components/Pagination/Pagination";

export default createRoute((c) => {
  const { entries, hasPrevious, hasNext } = getEntries(1);
  return c.render(
    <Fragment>
      <div className="flex flex-col gap-5 my-6">
        {entries.map((entry) => {
          return <EntryListItem entry={entry} />;
        })}
      </div>
      <Pagination currentPage={1} hasPrevious={hasPrevious} hasNext={hasNext} />
    </Fragment>,
  );
});
