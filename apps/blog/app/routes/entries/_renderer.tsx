import { jsxRenderer } from "hono/jsx-renderer";

export default jsxRenderer(({ children, Layout }) => {
  return (
    <Layout>
      <article class="article pb-8">{children}</article>
    </Layout>
  );
});
