import { useEffect } from "hono/jsx";
import { initContentTree } from "../lib/contentTree";
import type { Heading } from "../lib/entries";

type Props = {
	headings: Heading[];
};

export default function ContentTree({ headings }: Props) {
	useEffect(() => {
		initContentTree();
	}, []);

	if (headings.length === 0) return null;

	return (
		<aside id="entry-toc" aria-label="content-tree">
			<span class="hidden md:block">content tree</span>
			<details id="entry-toc-details" open class="md:contents">
				<summary class="relative flex gap-2 h-10 w-full cursor-pointer list-none items-center justify-left rounded-lg [&::-webkit-details-marker]:hidden md:hidden">
					<span>content tree</span>
					<span class="rotate-90" aria-hidden="true">
						&gt;
					</span>
				</summary>
				<div class="top-full z-50 max-h-[calc(100svh-var(--header-height)-3rem)] overflow-y-auto bg-background md:static md:max-h-none md:overflow-visible md:bg-transparent">
					<ul
						id="entry-toc-list"
						class="space-y-1 overflow-x-hidden px-0 py-0 rounded text-sm bg-green-1 md:rounded-none md:overflow-visible md:bg-transparent md:px-0 md:py-0"
					>
						{headings.map((heading) => (
							<HeadingItem
								key={heading.id ?? `${heading.depth}-${heading.value}`}
								heading={heading}
								depth={heading.depth}
							/>
						))}
					</ul>
				</div>
			</details>
		</aside>
	);
}

type HeadingItemProps = {
	heading: Heading;
	depth: number;
};

function HeadingItem({ heading, depth }: HeadingItemProps) {
	const hasChildren = heading.children.length > 0;

	return (
		<li>
			{heading.href ? (
				<a
					href={heading.href}
					data-toc-id={heading.id}
					class="flex w-full max-w-full items-start gap-1 rounded px-2 py-1 text-secondary leading-5 hover:text-hover aria-[current=location]:bg-green-4 aria-[current=location]:text-primary md:w-fit"
				>
					<span
						class="inline-flex size-4 shrink-0 scale-x-75 items-center justify-center font-['Noto_Sans_Mono',monospace] font-bold"
						aria-hidden="true"
					>
						└
					</span>
					<span class="min-w-0 wrap-break-words">{heading.value}</span>
				</a>
			) : (
				<span class="flex items-start gap-1 px-2 py-1 text-secondary leading-5">
					{depth > 2 && (
						<span
							class="inline-flex size-4 shrink-0 scale-x-75 items-center justify-center font-['Noto_Sans_Mono',monospace] font-bold"
							aria-hidden="true"
						>
							└
						</span>
					)}
					<span class="min-w-0">{heading.value}</span>
				</span>
			)}

			{hasChildren && (
				<ul
					class="ms-3 max-h-0 overflow-hidden border-s border-gray-6 ps-2 opacity-0 transition-[max-height,opacity] duration-500 ease-in-out motion-reduce:transition-none"
					data-toc-children-id={heading.id}
					aria-hidden="true"
				>
					{heading.children.map((child) => (
						<HeadingItem
							key={child.id ?? `${child.depth}-${child.value}`}
							heading={child}
							depth={child.depth}
						/>
					))}
				</ul>
			)}
		</li>
	);
}
