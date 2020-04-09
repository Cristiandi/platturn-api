const up = knex => {
  return knex.schema.hasTable('AssignedRole').then(exists => {
    if (exists) {
      return knex.schema.table('AssignedRole', table => {
        table.boolean('main').defaultTo(false)
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('AssignedRole').then(exists => {
    if (exists) {
      return knex.schema.table('AssignedRole', table => {
        table.dropColumn('AssignedRole')
      })
    }
  })
}

module.exports = {
  up,
  down
}
