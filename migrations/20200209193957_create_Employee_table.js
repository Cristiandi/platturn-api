const up = knex => {
  return knex.schema.hasTable('Employee').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Employee', table => {
        table.increments('id')
        table.string('document', 15).notNullable()
        table.string('firtsName', 50).notNullable()
        table.string('secondName', 50).notNullable()
        table.string('firtsLastName', 50).notNullable()
        table.string('secondLastName', 50).notNullable()
        table.string('address', 100).notNullable()
        table.string('phone', 10).notNullable()
        table.decimal('baseSalary', 12, 2).notNullable()
        table.integer('headQuaterId').unsigned().notNullable()
        table.timestamps(true, true)

        table.foreign('headQuaterId').references('HeadQuater.id').onDelete('NO ACTION').onUpdate('NO ACTION')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('Employee').then(exists => {
    if (exists) {
      knex.schema.dropTable('Employee')
    }
  })
}

module.exports = {
  up,
  down
}
