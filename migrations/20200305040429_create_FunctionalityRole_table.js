const up = knex => {
  return knex.schema.hasTable('FunctionalityRole').then(exists => {
    if (!exists) {
      return knex.schema.createTable('FunctionalityRole', table => {
        table.increments('id')
        table.boolean('allowed').defaultTo(false)
        table.integer('functionalityId').unsigned().notNullable()
        table.integer('roleId').unsigned().notNullable()
        table.timestamps(true, true)

        table.foreign('functionalityId').references('Functionality.id').onDelete('NO ACTION').onUpdate('NO ACTION')
        table.foreign('roleId').references('Role.id').onDelete('NO ACTION').onUpdate('NO ACTION')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('FunctionalityRole').then(exists => {
    if (exists) {
      knex.schema.dropTable('FunctionalityRole')
    }
  })
}

module.exports = {
  up,
  down
}
