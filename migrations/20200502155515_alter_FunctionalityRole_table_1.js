const up = knex => {
  return knex.schema.hasTable('FunctionalityRole').then(exists => {
    if (exists) {
      return knex.schema.alterTable('FunctionalityRole', table => {
        table.unique(['functionalityId', 'roleId'])
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('FunctionalityRole').then(exists => {
    if (exists) {
      knex.schema.dropUnique(['functionalityId', 'roleId'])
    }
  })
}

module.exports = {
  up,
  down
}
