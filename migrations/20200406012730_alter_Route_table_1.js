const up = knex => {
  return knex.schema.hasTable('Route').then(exists => {
    if (exists) {
      return knex.schema.alterTable('Route', table => {
        table.renameColumn('public', 'isPublic')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('Route').then(exists => {
    if (exists) {
      return knex.schema.alterTable('Route', table => {
        table.renameColumn('isPublic', 'public')
      })
    }
  })
}

module.exports = {
  up,
  down
}
