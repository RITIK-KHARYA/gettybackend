import { Hono } from "hono";
import {auth } from "../lib/auth"
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authApp = new Hono()
.on(["POST", "GET"], "/api/auth/**", (c) => { 
  return auth.handler(c.req.raw);
});
export default authApp

