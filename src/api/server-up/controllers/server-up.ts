import serverUpService from "../services/server-up";
import { Context } from "koa";

export default {
  async index(ctx: Context) {
    ctx.body = { status: serverUpService().getStatus() };
  },
};
