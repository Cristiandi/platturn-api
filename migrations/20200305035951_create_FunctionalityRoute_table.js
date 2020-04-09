const up = knex => {
  return knex.schema.hasTable('FunctionalityRoute').then(exists => {
    if (!exists) {
      return knex.schema.createTable('FunctionalityRoute', table => {
        table.increments('id')
        table.integer('functionalityId').unsigned().notNullable()
        table.integer('routeId').unsigned().notNullable()
        table.timestamps(true, true)

        table.foreign('functionalityId').references('Functionality.id').onDelete('NO ACTION').onUpdate('NO ACTION')
        table.foreign('routeId').references('Route.id').onDelete('NO ACTION').onUpdate('NO ACTION')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('FunctionalityRoute').then(exists => {
    if (exists) {
      knex.schema.dropTable('FunctionalityRoute')
    }
  })
}

module.exports = {
  up,
  down
}
