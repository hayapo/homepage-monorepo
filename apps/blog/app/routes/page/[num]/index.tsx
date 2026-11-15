import type { Env } from "hono";
import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { EntryListItem } from "../../../components/EntryListItem/EntryListItem";
import { Pagination } from "../../../components/Pagination/Pagination";
import { getAllEntries, getEntries, getMaxPageNum } from "../../../lib/entries";

const param = ssgParams<Env>((_c) => {
	const entries = getAllEntries();
	const maxPageNum = getMaxPageNum(entries);

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
	const pageNum = Number(numStr);
	if (
		!/^\d+$/.test(numStr) ||
		!Number.isInteger(pageNum) ||
		pageNum < 2 ||
		pageNum > getMaxPageNum(getAllEntries())
	) {
		return c.notFound();
	}

	const { entries, hasPrevious, hasNext } = getEntries(pageNum);

	return c.render(
		<div className="grid grid-cols-12">
			<div className="col-span-12 mx-auto w-full max-w-(--max-width) px-4">
				{entries.map((entry) => {
					return <EntryListItem entry={entry} />;
				})}
			</div>
			<div className="col-span-12 mx-auto w-full max-w-(--max-width) px-4">
				<Pagination
					currentPage={pageNum}
					hasPrevious={hasPrevious}
					hasNext={hasNext}
				/>
			</div>
		</div>,
	);
});
