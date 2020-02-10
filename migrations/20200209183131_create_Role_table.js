const up = knex => {
  return knex.schema.hasTable('Role').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Role', table => {
        table.increments('id');
        table.string('name', 45).notNullable();
        table.string('code', 5).notNullable();
        table.timestamps(true, true);

        table.unique('code');
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('Role').then(exists => {
    if (exists) {
      knex.schema.dropTable('Role');
    }
  });
};

module.exports = {
  up,
  down
};
