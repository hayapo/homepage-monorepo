import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { ENTRIES_PER_PAGE, getAllEntries, getEntries, getMaxPageNum } from "../../../lib/entries";
import type { Env } from "hono";
import { Fragment } from "hono/jsx/jsx-runtime";
import { EntryListItem } from "../../../components/EntryListItem/EntryListItem";
import { Pagination } from "../../../components/Pagination/Pagination";

const param = ssgParams<Env>((_c) => {
  const entries = getAllEntries();
  const maxPageNum = getMaxPageNum(entries);
  console.log(maxPageNum);
  const params = [];
  for (let num = 1; num <= maxPageNum; num++) {
    if (num <= 1) {
      continue;
    }
    params.push({ num: num.toString() });
  }
  return params;
});

export default createRoute(param, (c) => {
  const numStr = c.req.param("num");
  if (!numStr) {
    return c.notFound();
  }
  const pageNum = Number.parseInt(numStr);

  const { entries, hasPrevious, hasNext } = getEntries(pageNum);
  const onlyOnePage = entries.length < ENTRIES_PER_PAGE;

  return c.render(
    <Fragment>
      <div>
        {entries.map((entry) => {
          return <EntryListItem entry={entry} />;
        })}
      </div>
      {!onlyOnePage && <Pagination currentPage={pageNum} hasPrevious={hasPrevious} hasNext={hasNext} />}
    </Fragment>,
  );
});
