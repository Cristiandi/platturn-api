
const seed = async knex => {
  const plans = [
    {
      id: 1,
      name: 'Plan mensual',
      code: 'PL01',
      numberOfDays: 30
    },
    {
      id: 2,
      name: 'Plan trimestral',
      code: 'PL02',
      numberOfDays: 90
    },
    {
      id: 3,
      name: 'Plan semestral',
      code: 'PL03',
      numberOfDays: 180
    },
    {
      id: 4,
      name: 'Plan anual',
      code: 'PL04',
      numberOfDays: 365
    },
    {
      id: 5,
      name: 'Plan gratis',
      code: 'PL05',
      numberOfDays: 0
    }
  ];

  const promises = plans.map(async plan => {
    const rows = await knex('Plan').select('id').where('code', plan.code);
    if (!rows.length) {
      const [id] = await knex('Plan').insert(plan);
      return { id };
    } else {
      await knex('Plan')
        .update({ ...plan })
        .where({
          code: plan.code
        });
    }
  });

  await Promise.all(promises);
};

module.exports = {
  seed
};
