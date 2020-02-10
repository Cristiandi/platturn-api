const up = knex => {
  return knex.schema.hasTable('Shift').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Shift', table => {
        table.increments('id');
        table.datetime('startAt').defaultTo(null);
        table.datetime('endAt').defaultTo(null);
        table.datetime('incidentStartAt').defaultTo(null);
        table.datetime('incidentEndAt').defaultTo(null);
        table.string('observation', 500).defaultTo(null);
        table.integer('employeeId').unsigned().notNullable();
        table.integer('sheduleId').unsigned().notNullable();
        table.timestamps(true, true);

        table.foreign('employeeId').references('Employee.id').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.foreign('sheduleId').references('Shedule.id').onDelete('NO ACTION').onUpdate('NO ACTION');
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('Shedule').then(exists => {
    if (exists) {
      knex.schema.dropTable('Shedule');
    }
  });
};

module.exports = {
  up,
  down
};
