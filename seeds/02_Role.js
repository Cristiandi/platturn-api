
const seed = async knex => {
  const roles = [
    {
      id: 1,
      name: 'Desarrollador',
      code: 'RO01'
    },
    {
      id: 2,
      name: 'Administrador',
      code: 'RO02'
    },
    {
      id: 3,
      name: 'Usuario',
      code: 'RO03'
    },
    {
      id: 4,
      name: 'Usuario basico',
      code: 'RO04'
    }
  ]

  const promises = roles.map(async role => {
    const rows = await knex('Role').select('id').where('code', role.code)
    if (!rows.length) {
      const [id] = await knex('Role').insert(role)
      return { id }
    } else {
      await knex('Role')
        .update({ ...role })
        .where({
          code: role.code
        })
    }
  })

  await Promise.all(promises)
}

module.exports = {
  seed
}
