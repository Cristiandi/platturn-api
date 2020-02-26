const up = knex => {
  return knex.schema.hasTable('Company').then(exists => {
    if (exists) {
      return knex.schema.table('Company', table => {
        table.integer('userId').unsigned().notNullable();

        table.foreign('userId').references('User.id').onDelete('NO ACTION').onUpdate('NO ACTION');
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('Company').then(exists => {
    if (exists) {
      return knex.schema.table('Company', table => {
        table.dropForeign('userId');

        table.dropColumn('userId');
      });
    }
  });
};

module.exports = {
  up,
  down
};
