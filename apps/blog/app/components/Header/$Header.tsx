export const Header = () => {
  return (
    <header class="h-(--header-height)">
      <div class="h-(--header-height) max-w-(--max-width) mx-auto flex justify-between items-center">
        <a href="/" class="text-(length:--header-font-size) font-(--header-font-weight) hover:underline">
          hayapo.dev
        </a>
      </div>
    </header>
  );
};
