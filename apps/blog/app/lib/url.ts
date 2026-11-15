export const blogBase = import.meta.env.BASE_URL;

/** Join a blog-relative path to the build-time public base URL. */
export function blogUrl(path = "/"): string {
	return `${blogBase}${path.replace(/^\/+/, "")}`;
}
