const up = knex => {
  return knex.schema.hasTable('Characteristic').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Characteristic', table => {
        table.increments('id');
        table.string('name', 50).notNullable();
        table.string('value', 20).notNullable();
        table.string('description', 200);
        table.integer('planId').unsigned().notNullable();
        table.timestamps(true, true);

        table.unique(['name', 'planId']);
        table.foreign('planId').references('Plan .id').onDelete('NO ACTION').onUpdate('NO ACTION');
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('Characteristic').then(exists => {
    if (exists) {
      knex.schema.dropTable('Characteristic');
    }
  });
};

module.exports = {
  up,
  down
};
