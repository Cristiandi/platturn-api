const up = knex => {
  return knex.schema.hasTable('Shedule').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Shedule', table => {
        table.increments('id')
        table.string('description', 100)
        table.datetime('paymentPeriodDate').notNullable()
        table.datetime('rechargeStartDate').notNullable()
        table.datetime('rechargeEndDate').notNullable()
        table.integer('companyId').unsigned().notNullable()
        table.integer('sheduleTypeId').unsigned().notNullable()
        table.timestamps(true, true)

        table.foreign('companyId').references('Company.id').onDelete('NO ACTION').onUpdate('NO ACTION')
        table.foreign('sheduleTypeId').references('SheduleType.id').onDelete('NO ACTION').onUpdate('NO ACTION')
      })
    }
  })
}

const down = knex => {
  return knex.schema.hasTable('Shedule').then(exists => {
    if (exists) {
      knex.schema.dropTable('Shedule')
    }
  })
}

module.exports = {
  up,
  down
}
