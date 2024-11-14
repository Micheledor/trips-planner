import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert';
import { buildConfig, sortResponse, generateCacheKey } from '../utils.js';

test('buildConfig should return correct config for GET requests', (t) => {
  const req = {
    method: 'GET',
    query: {
      origin: 'NYC',
      destination: 'LA',
      sort_by: 'cost',
    },
  };
  const config = buildConfig(req);
  assert.strictEqual(config.options.method, 'GET');
  assert.strictEqual(config.options.headers['Content-Type'], 'application/json');
  assert.strictEqual(config.options.headers['x-api-key'], process.env.BIZAWAY_API_KEY);
  assert.strictEqual(config.url, `${process.env.BIZAWAY_API_BASE_URL}?origin=NYC&destination=LA&sort_by=cost`);
});

// test('buildConfig should return correct config for non-GET requests', () => {
//   const req = {
//     method: 'POST',
//     body: {
//       bizaway_id: '12345',
//     },
//   };
//   const config = buildConfig(req);
//   assert.equal(config.url, '${process.env}/12345');
// });

// test('sortResponse should sort trips by cost when sort_by is "cost"', () => {
//   const trips = [{ cost: 200 }, { cost: 100 }, { cost: 150 }];
//   const sortedTrips = sortResponse(trips, { sort_by: 'cost' });
//   assert.deepEqual(sortedTrips, [{ cost: 100 }, { cost: 150 }, { cost: 200 }]);
// });
