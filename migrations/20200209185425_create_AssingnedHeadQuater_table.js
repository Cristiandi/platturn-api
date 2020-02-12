const up = knex => {
  return knex.schema.hasTable('AssingnedHeadQuater').then(exists => {
    if (!exists) {
      return knex.schema.createTable('AssingnedHeadQuater', table => {
        table.increments('id');
        table.integer('userId').unsigned().notNullable();
        table.integer('headQuaterId').unsigned().notNullable();
        table.timestamps(true, true);

        table.foreign('userId').references('User.id').onDelete('NO ACTION').onUpdate('NO ACTION');
        table.foreign('headQuaterId').references('HeadQuater.id').onDelete('NO ACTION').onUpdate('NO ACTION');
      });
    }
  });
};

const down = knex => {
  return knex.schema.hasTable('AssingnedHeadQuater').then(exists => {
    if (exists) {
      knex.schema.dropTable('AssingnedHeadQuater');
    }
  });
};

module.exports = {
  up,
  down
};
