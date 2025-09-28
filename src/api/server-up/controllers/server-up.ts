import serverUpService from "../services/server-up";

export default {
  async index(ctx) {
    ctx.body = { status: serverUpService().getStatus() };
  },
};
