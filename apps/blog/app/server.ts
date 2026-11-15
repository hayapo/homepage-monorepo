import { type Env, Hono } from "hono";
import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";
import { blogBase } from "./lib/url";

const blog = createApp({
	app: new Hono<Env>({ strict: false }),
	trailingSlash: false,
	init(_app) {},
});

const app = new Hono<Env>({ strict: false }).route(
	blogBase.replace(/\/$/, ""),
	blog,
);

showRoutes(app);

export default app;
