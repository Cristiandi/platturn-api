const up = knex => {
  return knex.schema.hasTable('Route').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Route', table => {
        table.increments('id')
        table.string('httpMethod', 10).notNullable()
        table.string('path', 200).notNullable()
        table.boolean('public').defaultTo(false)
        table.timestamps(true, true)

        table.unique(['httpMethod', 'path'])
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('Route').then(exists => {
    if (exists) {
      knex.schema.dropTable('Route')
    }
  })
}

module.exports = {
  up,
  down
}
