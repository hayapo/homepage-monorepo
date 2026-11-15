import { createRoute } from "honox/factory";
import { EntryListItem } from "../components/EntryListItem/EntryListItem";
import { Pagination } from "../components/Pagination/Pagination";
import { getEntries } from "../lib/entries";

export default createRoute((c) => {
	const { entries, hasPrevious, hasNext } = getEntries(1);
	return c.render(
		<div className="grid grid-cols-12">
			<div className="col-span-12 mx-auto mb-6 flex w-full max-w-(--max-width) flex-col gap-3 px-4">
				{entries.map((entry) => {
					return <EntryListItem key={entry.id} entry={entry} />;
				})}
			</div>
			<div className="col-span-12 mx-auto w-full max-w-(--max-width) px-4">
				<Pagination
					currentPage={1}
					hasPrevious={hasPrevious}
					hasNext={hasNext}
				/>
			</div>
		</div>,
	);
});
