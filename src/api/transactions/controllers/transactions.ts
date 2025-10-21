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
  async initialise(ctx: Context) {
    try {
      const baseUrl = process.env.WALS_API_SERVER;
      if (!baseUrl) {
        ctx.throw(500, "Server isn't configured properly");
      }

      const headers: Record<string, string> = {};
      const auth = ctx.headers?.authorization;
      if (auth) headers.authorization = Array.isArray(auth) ? auth[0] : auth;
      const contentType = ctx.headers?.["content-type"];
      if (contentType) headers["content-type"] = Array.isArray(contentType) ? contentType[0] : contentType;

      const response = await axios.request({
        method: (ctx.method || "post").toLowerCase() as any,
        url: `${baseUrl}/transactions/initialise`,
        params: ctx.query,
        data: ctx.request.body,
        headers,
      });

      ctx.status = response.status;
      ctx.body = response.data;
    } catch (error: any) {
      strapi.log.error("Error initialising transaction:", error.message);
      ctx.status = error.response?.status || 500;
      ctx.body = {
        message: "Failed to initialise transaction with Laravel service",
        error: error.response?.data || error.message,
      };
    }
  },
};
