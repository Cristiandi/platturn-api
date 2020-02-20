const up = knex => {
  return knex.schema.hasTable('User').then(exists => {
    if (exists) {
      return knex.schema.table('User', table => {
        table.boolean('verifiedEmail').defaultTo(false);
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('User').then(exists => {
    if (exists) {
      return knex.schema.table('User', table => {
        table.dropColumn('verifiedEmail');
      });
    }
  });
};

module.exports = {
  up,
  down
};
