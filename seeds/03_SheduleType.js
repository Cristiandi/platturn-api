
const seed = async knex => {
  const sheduleTypes = [
    {
      id: 1,
      name: 'Mensual',
      code: 'ST01',
      numberOfDays: 30
    },
    {
      id: 2,
      name: 'Quincenal',
      code: 'ST02',
      numberOfDays: 15
    }
  ]

  const promises = sheduleTypes.map(async sheduleType => {
    const rows = await knex('SheduleType').select('id').where('code', sheduleType.code)
    if (!rows.length) {
      const [id] = await knex('SheduleType').insert(sheduleType)
      return { id }
    } else {
      await knex('SheduleType')
        .update({ ...sheduleType })
        .where({
          code: sheduleType.code
        })
    }
  })

  await Promise.all(promises)
}

module.exports = {
  seed
}
