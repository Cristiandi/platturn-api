const up = knex => {
  return knex.schema.hasTable('AssignedRole').then(exists => {
    if (!exists) {
      return knex.schema.createTable('AssignedRole', table => {
        table.increments('id')
        table.boolean('active').defaultTo(false)
        table.integer('userId').unsigned().notNullable()
        table.integer('roleId').unsigned().notNullable()
        table.timestamps(true, true)

        table.foreign('userId').references('User.id').onDelete('NO ACTION').onUpdate('NO ACTION')
        table.foreign('roleId').references('Role.id').onDelete('NO ACTION').onUpdate('NO ACTION')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('AssignedRole').then(exists => {
    if (exists) {
      knex.schema.dropTable('AssignedRole')
    }
  })
}

module.exports = {
  up,
  down
}
