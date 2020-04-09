const up = knex => {
  return knex.schema.hasTable('Screen').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Screen', table => {
        table.increments('id')
        table.string('name', 50).notNullable()
        table.string('path', 200)
        table.string('relativePath', 200)
        table.integer('functionalityId').unsigned().notNullable()
        table.timestamps(true, true)

        table.unique('name')
        table.foreign('functionalityId').references('Functionality.id').onDelete('NO ACTION').onUpdate('NO ACTION')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('Screen').then(exists => {
    if (exists) {
      knex.schema.dropTable('Screen')
    }
  })
}

module.exports = {
  up,
  down
}
