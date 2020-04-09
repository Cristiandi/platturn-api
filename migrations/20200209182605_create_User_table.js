const up = knex => {
  return knex.schema.hasTable('User').then(exists => {
    if (!exists) {
      return knex.schema.createTable('User', table => {
        table.increments('id')
        table.string('authUid', 45).notNullable()
        table.string('fullName', 100).notNullable()
        table.string('document', 15).notNullable()
        table.string('email', 100).notNullable()
        table.string('address', 100).notNullable()
        table.string('phone', 10).notNullable()
        table.timestamps(true, true)

        table.unique('authUid')
        table.unique('document')
        table.unique('email')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('User').then(exists => {
    if (exists) {
      knex.schema.dropTable('User')
    }
  })
}

module.exports = {
  up,
  down
}
