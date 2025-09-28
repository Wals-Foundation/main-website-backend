export default {
  routes: [
    {
      method: "GET",
      path: "/server-up",
      handler: "server-up.index",
      config: {
        auth: false,
      },
    },
  ],
};
