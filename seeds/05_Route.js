const seed = async (knex) => {
  const routes = [
    {
      id: 1,
      httpMethod: 'POST',
      path: '/api/users',
      public: true
    },
    {
      id: 2,
      httpMethod: 'GET',
      path: '/api/users/:userId',
      public: false
    },
    {
      id: 3,
      httpMethod: 'POST',
      path: '/api/users/login',
      public: true
    },
    {
      id: 4,
      httpMethod: 'POST',
      path: '/api/users/send-confimation-email/:code',
      public: true
    },
    {
      id: 5,
      httpMethod: 'POST',
      path: '/api/users/send-forgot-password-email',
      public: true
    },
    {
      id: 6,
      httpMethod: 'POST',
      path: '/api/users/change-password-from-code',
      public: true
    },
    {
      id: 7,
      httpMethod: 'POST',
      path: '/api/users/change-password',
      public: false
    },
    {
      id: 8,
      httpMethod: 'POST',
      path: '/api/users/change-email-address',
      public: false
    },
    {
      id: 9,
      httpMethod: 'PATCH',
      path: '/api/users/update-user-data',
      public: false
    },
    {
      id: 10,
      httpMethod: 'GET',
      path: '/api/users/validate-token',
      public: true
    },
    {
      id: 11,
      httpMethod: 'POST',
      path: '/api/potential-leads',
      public: true
    },
    {
      id: 12,
      httpMethod: 'POST',
      path: '/api/companies',
      public: false
    },
    {
      id: 13,
      httpMethod: 'GET',
      path: '/api/companies/get-user-companies',
      public: false
    },
    {
      id: 14,
      httpMethod: 'PATCH',
      path: '/api/companies/:companyId',
      public: false
    },
    {
      id: 15,
      httpMethod: 'GET',
      path: '/api/users/get-user-screens',
      public: true
    },
    {
      id: 16,
      httpMethod: 'GET',
      path: '/api/plans',
      public: true
    },
    {
      id: 17,
      httpMethod: 'GET',
      path: '/api/functionalities',
      public: false
    }
  ];

  const promises = routes.map(async route => {
    const rows = await knex('Route').select('id')
      .where('id', route.id);

    if (rows.length === 0) {
      const id = (await knex('Route').insert(route))[0];
      return { id };
    } else {
      await knex('Route')
        .update({ ...route })
        .where({
          id: rows[0].id
        });
    }
    return { ...rows[0].id };
  });

  for (const promise of promises) {
    await promise;
  }
};

module.exports = {
  seed
};
