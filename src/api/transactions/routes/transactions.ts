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
    {
      method: 'POST',
      path: '/transactions/initialise',
      handler: 'transactions.initialise',
      config: {
        auth: false,
      },
    },
  ],
};
