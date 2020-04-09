const up = knex => {
  return knex.schema.hasTable('Functionality').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Functionality', table => {
        table.increments('id')
        table.string('name', 100).notNullable()
        table.string('code', 5).notNullable()
        table.timestamps(true, true)

        table.unique('name')
        table.unique('code')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('Functionality').then(exists => {
    if (exists) {
      knex.schema.dropTable('Functionality')
    }
  })
}

module.exports = {
  up,
  down
}
