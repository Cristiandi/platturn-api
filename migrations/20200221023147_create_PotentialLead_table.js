const up = knex => {
  return knex.schema.hasTable('PotentialLead').then(exists => {
    if (!exists) {
      return knex.schema.createTable('PotentialLead', table => {
        table.increments('id')
        table.string('fullName', 100).notNullable()
        table.string('email', 100).notNullable()
        table.string('phone', 10).notNullable()
        table.string('observation', 200).notNullable()
        table.timestamps(true, true)

        table.unique('email')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('PotentialLead').then(exists => {
    if (exists) {
      knex.schema.dropTable('PotentialLead')
    }
  })
}

module.exports = {
  up,
  down
}
