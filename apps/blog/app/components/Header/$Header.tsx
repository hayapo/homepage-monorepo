import { useRequestContext } from "hono/jsx-renderer";

export const Header = () => {
  const blogTitle = "hayapo.log()";
  const c = useRequestContext();
  const isHome = c.req.path === "/";
  return (
    <header class="h-(--header-height)">
      <div class="h-(--header-height) max-w-(--max-width) mx-auto flex justify-between items-center">
        {isHome ? (
          <h1 class="text-(length:--header-font-size) font-(--header-font-weight) font-mono">{blogTitle}</h1>
        ) : (
          <a
            href="/"
            class="text-(length:--header-font-size) font-(--header-font-weight) hover:bg-green-a6 rounded-sm font-mono"
          >
            {blogTitle}
          </a>
        )}
      </div>
    </header>
  );
};
