const seed = async (knex) => {
  const functionalities = [
    {
      id: 1,
      name: 'Gestión de usuario',
      code: '01GU'
    },
    {
      id: 2,
      name: 'Gestión de empresas',
      code: '02GE'
    },
    {
      id: 3,
      name: 'Gestión de funcionalidades',
      code: '03GF'
    }
  ];

  const promises = functionalities.map(async functionality => {
    const rows = await knex('Functionality').select('id')
      .where('id', functionality.id);

    if (rows.length === 0) {
      const id = (await knex('Functionality').insert(functionality))[0];
      return { id };
    } else {
      await knex('Functionality')
        .update({ ...functionality })
        .where({
          id: rows[0].id
        });
    }
    return { ...rows[0].id };
  });

  for (const promise of promises) {
    await promise;
  }
};

module.exports = {
  seed
};
