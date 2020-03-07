const { pathToRegexp } = require('path-to-regexp');

const routes = [
  '/api/users/login',
  '/api/users/change-password',
  '/api/users/:userId',
  '/api/users/send-confimation-email/:code',
  '/api/users/:userId/invoicing/:companyId'
];

const incomingRoute = '/api/users/6?filter=%7B%7D';

const opts = {
  strict: false,
  sensitive: false,
  end: true,
  decode: decodeURIComponent
};

for (const route of routes) {
  const keys = [];
  const regexp = pathToRegexp(route, keys, opts);
  // console.log(route, keys);
  const urlToCheck = incomingRoute.split('?')[0];
  // eslint-disable-next-line no-console
  console.log('urlToCheck', urlToCheck);
  const result = regexp.exec(urlToCheck);
  // eslint-disable-next-line no-console
  console.log('result', result);
  if (result) break;
}
