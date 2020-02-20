const up = knex => {
  return knex.schema.hasTable('Parameter').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Parameter', table => {
        table.increments('id');
        table.string('name', 100).notNullable();
        table.string('value', 255).notNullable();
        table.string('description', 255).notNullable();
        table.boolean('hashed').defaultTo(false);
        table.timestamps(true, true);

        table.unique('name');
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('Parameter').then(exists => {
    if (exists) {
      knex.schema.dropTable('Parameter');
    }
  });
};

module.exports = {
  up,
  down
};
