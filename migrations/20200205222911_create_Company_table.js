const up = knex => {
  return knex.schema.hasTable('Company').then(exists => {
    if (!exists) {
      return knex.schema.createTable('Company', table => {
        table.increments('id');
        table.string('name', 45).notNullable();
        table.string('code', 5).notNullable();
        table.string('document', 15).notNullable();
        table.string('email', 100).notNullable();
        table.timestamps(true, true);

        table.unique('document');
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('Company').then(exists => {
    if (exists) {
      knex.schema.dropTable('Company');
    }
  });
};

module.exports = {
  up,
  down
};
