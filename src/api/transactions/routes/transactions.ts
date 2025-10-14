export default {
  routes: [
    {
      method: 'GET',
      path: '/transactions',
      handler: 'transactions.getTransactions',
      config: {
        auth: false,
      },
    },
  ],
};
