const up = knex => {
  return knex.schema.hasTable('User').then(exists => {
    if (exists) {
      return knex.schema.table('User', table => {
        table.integer('companyId').unsigned();

        table.foreign('companyId').references('Company.id').onDelete('NO ACTION').onUpdate('NO ACTION');
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('User').then(exists => {
    if (exists) {
      return knex.schema.table('User', table => {
        table.dropForeign('companyId');

        table.dropColumn('companyId');
      });
    }
  });
};

module.exports = {
  up,
  down
};
