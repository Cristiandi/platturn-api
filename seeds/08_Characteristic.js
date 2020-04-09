const seed = async (knex) => {
  const characteristics = [
    {
      id: 1,
      name: 'NUMBER_OF_COMPANIES',
      value: '1',
      description: '',
      planId: 1
    },
    {
      id: 2,
      name: 'NUMBER_OF_COMPANIES',
      value: '1',
      description: '',
      planId: 2
    },
    {
      id: 3,
      name: 'NUMBER_OF_COMPANIES',
      value: '1',
      description: '',
      planId: 3
    }
  ]

  const promises = characteristics.map(async characteristic => {
    const rows = await knex('Characteristic').select('id')
      .where('id', characteristic.id)

    if (rows.length === 0) {
      const id = (await knex('Characteristic').insert(characteristic))[0]
      return { id }
    } else {
      await knex('Characteristic')
        .update({ ...characteristic })
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
