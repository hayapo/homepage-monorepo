export function initContentTree() {
	const toc = document.getElementById('entry-toc');
	if (!toc) return;
	const details = toc.querySelector<HTMLDetailsElement>('#entry-toc-details');
	const mobileLayout = window.matchMedia('(max-width: 47.999rem)');
	if (details) details.open = !mobileLayout.matches;
	mobileLayout.addEventListener('change', (event) => {
		if (details) details.open = !event.matches;
	});

	const links = new Map(
		Array.from(toc.querySelectorAll<HTMLAnchorElement>('a[data-toc-id]')).flatMap((link) =>
			link.dataset.tocId ? [[link.dataset.tocId, link] as const] : [],
		),
	);
	for (const link of links.values()) {
		link.addEventListener('click', () => {
			if (details && mobileLayout.matches) details.open = false;
		});
	}
	const childLists = Array.from(toc.querySelectorAll<HTMLUListElement>('ul[data-toc-children-id]'));
	const headings = Array.from(links.keys())
		.map((id) => document.getElementById(id))
		.filter((heading): heading is HTMLElement => heading instanceof HTMLElement);
	if (headings.length === 0) return;
	let fragmentHeadingId: string | undefined;

	const updateToc = (id: string) => {
		const activeLink = links.get(id);
		if (!activeLink) return;

		for (const link of links.values()) link.removeAttribute('aria-current');
		activeLink.setAttribute('aria-current', 'location');
		for (const list of childLists) {
			const open = list.dataset.tocChildrenId === id || list.contains(activeLink);
			if (!open) list.classList.add('duration-0');
			list.classList.toggle('max-h-0', !open);
			list.classList.toggle('max-h-96', open);
			list.classList.toggle('opacity-0', !open);
			list.classList.toggle('opacity-100', open);
			list.setAttribute('aria-hidden', String(!open));
			if (open) requestAnimationFrame(() => list.classList.remove('duration-0'));
		}
	};

	const updateCurrentHeading = () => {
		if (fragmentHeadingId && links.has(fragmentHeadingId)) {
			updateToc(fragmentHeadingId);
			return;
		}
		if (window.scrollY <= 0) {
			updateToc(headings[0].id);
			return;
		}
		if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
			updateToc(headings[headings.length - 1].id);
			return;
		}

		const activationLine = window.innerHeight / 2;
		const current =
			headings.filter((heading) => heading.getBoundingClientRect().top <= activationLine).at(-1) ?? headings[0];
		updateToc(current.id);
	};

	const observer = new IntersectionObserver(
		() => {
			updateCurrentHeading();
		},
		{ rootMargin: '-100px 0px -75% 0px' },
	);

	for (const heading of headings) observer.observe(heading);
	window.addEventListener('scroll', updateCurrentHeading, { passive: true });
	window.addEventListener('resize', updateCurrentHeading, { passive: true });

	const getHashId = () => {
		try {
			return decodeURIComponent(window.location.hash.slice(1));
		} catch {
			return window.location.hash.slice(1);
		}
	};
	const hashId = getHashId();
	if (links.has(hashId)) {
		fragmentHeadingId = hashId;
		updateToc(hashId);
	} else {
		updateCurrentHeading();
	}
	window.addEventListener('hashchange', () => {
		const id = getHashId();
		fragmentHeadingId = links.has(id) ? id : undefined;
		if (fragmentHeadingId) updateToc(fragmentHeadingId);
		else updateCurrentHeading();
	});
	const releaseFragmentHeading = () => {
		if (!fragmentHeadingId) return;
		fragmentHeadingId = undefined;
		updateCurrentHeading();
	};
	window.addEventListener('wheel', releaseFragmentHeading, { passive: true });
	window.addEventListener('touchstart', releaseFragmentHeading, { passive: true });
	window.addEventListener('keydown', releaseFragmentHeading);
}
