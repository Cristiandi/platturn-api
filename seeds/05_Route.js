const seed = async (knex) => {
  const routes = [
    {
      id: 1,
      httpMethod: 'POST',
      path: '/api/users',
      isPublic: true
    },
    {
      id: 2,
      httpMethod: 'GET',
      path: '/api/users/:userId',
      isPublic: false
    },
    {
      id: 3,
      httpMethod: 'POST',
      path: '/api/users/login',
      isPublic: true
    },
    {
      id: 4,
      httpMethod: 'POST',
      path: '/api/users/send-confimation-email/:code',
      isPublic: true
    },
    {
      id: 5,
      httpMethod: 'POST',
      path: '/api/users/send-forgot-password-email',
      isPublic: true
    },
    {
      id: 6,
      httpMethod: 'POST',
      path: '/api/users/change-password-from-code',
      isPublic: true
    },
    {
      id: 7,
      httpMethod: 'POST',
      path: '/api/users/change-password',
      isPublic: false
    },
    {
      id: 8,
      httpMethod: 'POST',
      path: '/api/users/change-email-address',
      isPublic: false
    },
    {
      id: 9,
      httpMethod: 'PATCH',
      path: '/api/users/update-user-data',
      isPublic: false
    },
    {
      id: 10,
      httpMethod: 'GET',
      path: '/api/users/validate-token',
      isPublic: true
    },
    {
      id: 11,
      httpMethod: 'POST',
      path: '/api/potential-leads',
      isPublic: true
    },
    {
      id: 12,
      httpMethod: 'POST',
      path: '/api/companies',
      isPublic: false
    },
    {
      id: 13,
      httpMethod: 'GET',
      path: '/api/companies/get-user-companies',
      isPublic: false
    },
    {
      id: 14,
      httpMethod: 'PATCH',
      path: '/api/companies/:companyId',
      isPublic: false
    },
    {
      id: 15,
      httpMethod: 'GET',
      path: '/api/users/get-user-screens',
      isPublic: true
    },
    {
      id: 16,
      httpMethod: 'GET',
      path: '/api/plans',
      isPublic: true
    },
    {
      id: 17,
      httpMethod: 'GET',
      path: '/api/functionalities',
      isPublic: false
    },
    {
      id: 18,
      httpMethod: 'POST',
      path: '/api/functionalities',
      isPublic: false
    },
    {
      id: 19,
      httpMethod: 'POST',
      path: '/api/functionalities/:functionalityId',
      isPublic: false
    },
    {
      id: 20,
      httpMethod: 'DELETE',
      path: '/api/functionalities/:functionalityId',
      isPublic: false
    },
    {
      id: 21,
      httpMethod: 'GET',
      path: '/api/screens',
      isPublic: false
    },
    {
      id: 22,
      httpMethod: 'POST',
      path: '/api/screens',
      isPublic: false
    },
    {
      id: 23,
      httpMethod: 'PATCH',
      path: '/api/screens/:screenId',
      isPublic: false
    },
    {
      id: 24,
      httpMethod: 'DELETE',
      path: '/api/screens/:screenId',
      isPublic: false
    },
    {
      id: 25,
      httpMethod: 'GET',
      path: '/api/routes',
      isPublic: false
    },
    {
      id: 26,
      httpMethod: 'POST',
      path: '/api/routes',
      isPublic: false
    },
    {
      id: 27,
      httpMethod: 'PATCH',
      path: '/api/routes/:storeId',
      isPublic: false
    },
    {
      id: 28,
      httpMethod: 'DELETE',
      path: '/api/routes/:storeId',
      isPublic: false
    }
  ]

  const promises = routes.map(async route => {
    const rows = await knex('Route').select('id')
      .where('id', route.id)

    if (rows.length === 0) {
      const id = (await knex('Route').insert(route))[0]
      return { id }
    } else {
      await knex('Route')
        .update({ ...route })
        .where({
          id: rows[0].id
        })
    }
    return { ...rows[0].id }
  })

  for (const promise of promises) {
    await promise
  }
}

module.exports = {
  seed
}
