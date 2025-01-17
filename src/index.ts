import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server } from "socket.io";
import { setupWebSocket } from "./ws";
import  userApp from "./api/user";
import { cors } from "hono/cors";
import authApp from "./api/auth";
import { auth } from "./lib/auth";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use(
  "*",
  cors({
    origin: "http://localhost:3002",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

export const httpServer = serve(app);

const io = new Server(httpServer, {
  path: "/ws",
});

app.route("/", userApp);
app.route("/",authApp)
setupWebSocket(io);

httpServer.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
