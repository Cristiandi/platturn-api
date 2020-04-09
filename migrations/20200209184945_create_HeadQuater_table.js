const up = knex => {
  return knex.schema.hasTable('HeadQuater').then(exists => {
    if (!exists) {
      return knex.schema.createTable('HeadQuater', table => {
        table.increments('id')
        table.string('name', 100).notNullable()
        table.string('address', 100).notNullable()
        table.integer('companyId').unsigned().notNullable()
        table.timestamps(true, true)

        table.foreign('companyId').references('Company.id').onDelete('NO ACTION').onUpdate('NO ACTION')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('HeadQuater').then(exists => {
    if (exists) {
      knex.schema.dropTable('HeadQuater')
    }
  })
}

module.exports = {
  up,
  down
}
