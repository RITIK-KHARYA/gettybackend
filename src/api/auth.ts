import { Hono } from "hono";
import {auth } from "../lib/auth"

const authApp = new Hono()
.on(["POST", "GET"], "/api/auth/**", (c) => { 
  return auth.handler(c.req.raw);
});
export default authApp

