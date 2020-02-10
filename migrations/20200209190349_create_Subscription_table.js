const up = knex => {
  return knex.schema.hasTable('Subscription').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Subscription', table => {
        table.increments('id');
        table.datetime('startAt').notNullable();
        table.datetime('endAt').notNullable();
        table.boolean('active').defaultTo(false);
        table.integer('companyId').unsigned().notNullable();
        table.integer('planId').unsigned().notNullable();
        table.timestamps(true, true);

        table.foreign('companyId').references('Company.id').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.foreign('planId').references('Plan.id').onDelete('NO ACTION').onUpdate('NO ACTION');
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('Subscription').then(exists => {
    if (exists) {
      knex.schema.dropTable('Subscription');
    }
  });
};

module.exports = {
  up,
  down
};
