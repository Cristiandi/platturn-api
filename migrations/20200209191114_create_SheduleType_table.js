const up = knex => {
  return knex.schema.hasTable('SheduleType').then(exists => {
    if (!exists) {
      return knex.schema.createTable('SheduleType', table => {
        table.increments('id')
        table.string('name', 45).notNullable()
        table.string('code', 5).notNullable()
        table.integer('numberOfDays').unsigned().notNullable()
        table.timestamps(true, true)

        table.unique('code')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('SheduleType').then(exists => {
    if (exists) {
      knex.schema.dropTable('SheduleType')
    }
  })
}

module.exports = {
  up,
  down
}
