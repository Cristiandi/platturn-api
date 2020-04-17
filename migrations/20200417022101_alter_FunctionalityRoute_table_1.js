const up = knex => {
  return knex.schema.hasTable('FunctionalityRoute').then(exists => {
    if (exists) {
      return knex.schema.alterTable('FunctionalityRoute', table => {
        table.unique(['functionalityId', 'routeId'])
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('FunctionalityRoute').then(exists => {
    if (exists) {
      knex.schema.dropUnique(['functionalityId', 'routeId'])
    }
  })
}

module.exports = {
  up,
  down
}
