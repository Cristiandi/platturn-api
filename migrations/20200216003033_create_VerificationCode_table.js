const up = knex => {
  return knex.schema.hasTable('VerificationCode').then(exists => {
    if (!exists) {
      return knex.schema.createTable('VerificationCode', table => {
        table.increments('id');
        table.string('code', 50).notNullable();
        table.datetime('expirationDate').notNullable();
        table.string('type', 50);
        table.integer('userId').unsigned().notNullable();
        table.timestamps(true, true);

        table.foreign('userId').references('User.id').onDelete('NO ACTION').onUpdate('NO ACTION');
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('VerificationCode').then(exists => {
    if (exists) {
      knex.schema.dropTable('VerificationCode');
    }
  });
};

module.exports = {
  up,
  down
};
