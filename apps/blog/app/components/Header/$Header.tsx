import {
	HEADER_HEIGHT_PX,
	HEADER_MOUNT_EVENT,
	HEADER_UNMOUNT_EVENT,
} from "@repo/ui/constants";
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
		<div style={{ height: `${HEADER_HEIGHT_PX}px` }} id={uniqueId}>
			{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
			<div
				style={{
					height: `${HEADER_HEIGHT_PX}px`,
					borderBottom: "1px solid #ccc",
					padding: "1em",
				}}
			></div>
		</div>
	);
};
