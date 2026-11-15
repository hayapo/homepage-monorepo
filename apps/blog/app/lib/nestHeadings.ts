import type { TocItem } from "rehype-mdx-toc";
import type { Heading } from "./entries";

export function nestHeadings(headings: TocItem[]): Heading[] {
	const roots: Heading[] = [];
	const stack: Heading[] = [];

	for (const heading of headings) {
		const node: Heading = {
			...heading,
			children: [],
		};

		while (stack.length > 0 && stack[stack.length - 1].depth >= node.depth) {
			stack.pop();
		}

		const parent = stack[stack.length - 1];

		if (parent) {
			parent.children.push(node);
		} else {
			roots.push(node);
		}

		stack.push(node);
	}

	return roots;
}
