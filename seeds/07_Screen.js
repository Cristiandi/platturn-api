const seed = async (knex) => {
  const screens = [
    {
      id: 1,
      name: 'Empresas',
      path: '/companies',
      relativePath: '',
      functionalityId: 2
    },
    {
      id: 2,
      name: 'Funcionalidades',
      path: '/functionalities',
      relativePath: '',
      functionalityId: 3
    }
  ]

  const promises = screens.map(async screen => {
    const rows = await knex('Screen').select('id')
      .where('id', screen.id)

    if (rows.length === 0) {
      const id = (await knex('Screen').insert(screen))[0]
      return { id }
    } else {
      await knex('Screen')
        .update({ ...screen })
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
