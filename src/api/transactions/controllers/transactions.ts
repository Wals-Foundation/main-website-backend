import axios from "axios";
import { Context } from "koa";

export default {
  async getTransactions(ctx: Context) {
    try {
      const baseUrl = process.env.WALS_API_SERVER;
      if (!baseUrl) {
        ctx.throw(500, "Server isn't configured properly");
      }

      const response = await axios.get(`${baseUrl}/transactions`, {
        params: ctx.query,
      });

      ctx.body = response.data;
    } catch (error: any) {
      strapi.log.error("Error fetching transactions:", error.message);
      ctx.status = error.response?.status || 500;
      ctx.body = {
        message: "Failed to fetch transactions from Laravel service",
        error: error.response?.data || error.message,
      };
    }
  },
};
