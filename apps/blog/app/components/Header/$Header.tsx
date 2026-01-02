import { HEADER_MOUNT_EVENT, HEADER_UNMOUNT_EVENT } from "@repo/ui/constants";
import { useEffect, useId } from "hono/jsx";

export const Header = () => {
	const uniqueId = useId();
	useEffect(() => {
		const element = document.getElementById(uniqueId);
		if (!element) {
			return;
		}
		document.dispatchEvent(
			new CustomEvent(HEADER_MOUNT_EVENT, { detail: { id: uniqueId } }),
		);

		return () =>
			document.dispatchEvent(
				new CustomEvent(HEADER_UNMOUNT_EVENT, { detail: { id: uniqueId } }),
			);
	}, [uniqueId]);
	return (
		<header class="h-(--header-height)" id={uniqueId}>
			<div class="h-(--header-height) max-w-(--max-width) mx-auto flex justify-between items-center">
				<div class="text-(length:--header-font-size) font-(--header-font-weight)">
					hayapo.dev
				</div>
			</div>
		</header>
	);
};
