import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert';
import { buildConfig, sortResponse, generateCacheKey } from '../routes/v1/trips/utils.js';
import { formatResponse } from '../routes/v1/trips/favourites/_id/details/utils.js';

test('Utils', async (t) => {
  await t.test('buildConfig should return correct config for GET requests', () => {
    const req = {
      method: 'GET',
      query: {
        origin: 'NYC',
        destination: 'LAX',
        sort_by: 'cost',
      },
    };
    const config = buildConfig(req);
    assert.strictEqual(config.options.method, 'GET');
    assert.strictEqual(config.options.headers['Content-Type'], 'application/json');
    assert.strictEqual(config.options.headers['x-api-key'], process.env.BIZAWAY_API_KEY);
    assert.strictEqual(config.url, `${process.env.BIZAWAY_API_BASE_URL}?origin=NYC&destination=LAX`);
  });

  await t.test('buildConfig should return correct config for non-GET requests', () => {
    const req = {
      method: 'POST',
      body: {
        bizaway_id: '12345',
      },
    };
    const config = buildConfig(req);
    assert.equal(config.url, `${process.env.BIZAWAY_API_BASE_URL}/12345`);
  });

  await t.test('sortResponse should sort trips by cost when sort_by is "cost"', () => {
    const trips = [
      { duration: 3, cost: 200 },
      { duration: 5, cost: 100 },
      { duration: 7, cost: 150 },
    ];
    const sortedTrips = sortResponse(trips, { sort_by: 'cost' });
    assert.deepEqual(sortedTrips, [
      { duration: 5, cost: 100 },
      { duration: 7, cost: 150 },
      { duration: 3, cost: 200 },
    ]);
  });

  await t.test('sortResponse should sort trips by duration when sort_by is "duration"', () => {
    const trips = [
      { duration: 3, cost: 200 },
      { duration: 5, cost: 100 },
      { duration: 7, cost: 150 },
    ];
    const sortedTrips = sortResponse(trips, { sort_by: 'duration' });
    assert.deepEqual(sortedTrips, [
      { duration: 3, cost: 200 },
      { duration: 5, cost: 100 },
      { duration: 7, cost: 150 },
    ]);
  });

  await t.test('sortResponse should handle an empty trips array', () => {
    const trips = [];
    const sortedTrips = sortResponse(trips, { sort_by: 'cost' });
    assert.deepEqual(sortedTrips, []);
  });

  await t.test('sortResponse should handle a single trip in the array', () => {
    const trips = [{ duration: 5, cost: 100 }];
    const sortedTrips = sortResponse(trips, { sort_by: 'cost' });
    assert.deepEqual(sortedTrips, [{ duration: 5, cost: 100 }]);
  });

  await t.test('sortResponse should maintain stability for trips with the same cost', () => {
    const trips = [
      { duration: 3, cost: 200 },
      { duration: 5, cost: 200 },
      { duration: 7, cost: 150 },
    ];
    const sortedTrips = sortResponse(trips, { sort_by: 'cost' });
    assert.deepEqual(sortedTrips, [
      { duration: 7, cost: 150 },
      { duration: 3, cost: 200 },
      { duration: 5, cost: 200 },
    ]);
  });

  await t.test('sortResponse should maintain stability for trips with the same duration', () => {
    const trips = [
      { duration: 3, cost: 200 },
      { duration: 5, cost: 100 },
      { duration: 5, cost: 150 },
    ];
    const sortedTrips = sortResponse(trips, { sort_by: 'duration' });
    assert.deepEqual(sortedTrips, [
      { duration: 3, cost: 200 },
      { duration: 5, cost: 100 },
      { duration: 5, cost: 150 },
    ]);
  });

  await t.test('generateCacheKey should return correct cache key', () => {
    const query = {
      origin: 'ARN',
      destination: 'ATL',
      sort_by: 'cost',
    };
    const cacheKey = generateCacheKey(query);
    assert.equal(cacheKey, 'ARN-ATL?sort_by=cost');
  });

  await t.test('generateCacheKey should work with pagination', () => {
    const query = {
      origin: 'ARN',
      destination: 'ATL',
      sort_by: 'cost',
      page: 1,
      per_page: 10,
    };
    const cacheKey = generateCacheKey(query);
    assert.equal(cacheKey, 'ARN-ATL?page=1&per_page=10&sort_by=cost');
  });

  await t.test('generateCacheKey should work with additional query params', () => {
    const query = {
      origin: 'ARN',
      destination: 'ATL',
      sort_by: 'cost',
      page: 1,
      per_page: 10,
      foo: 'bar',
    };
    const cacheKey = generateCacheKey(query);
    assert.equal(cacheKey, 'ARN-ATL?foo=bar&page=1&per_page=10&sort_by=cost');
  });

  await t.test('generateCacheKey should sort query params alphabetically after origin and destination', () => {
    const query = {
      origin: 'ARN',
      destination: 'ATL',
      sort_by: 'cost',
      a: 1,
      b: 1,
      c: 1,
    };
    const cacheKey = generateCacheKey(query);
    assert.equal(cacheKey, 'ARN-ATL?a=1&b=1&c=1&sort_by=cost');
  });

  await t.test('generateCacheKey should be consistent with the order of origin and destination', () => {
    const firstQuery = {
      origin: 'ARN',
      destination: 'ATL',
      sort_by: 'cost',
    };
    const secondQuery = {
      origin: 'ATL',
      destination: 'ARN',
      sort_by: 'cost',
    };

    const firstCacheKey = generateCacheKey(firstQuery);
    const secondCacheKey = generateCacheKey(secondQuery);

    assert.notEqual(firstCacheKey, secondCacheKey);
  });

  await t.test('formatResponse should return correct response', () => {
    const locationCache = {
      BCN: {
        location: {
          coordinates: [2.1737, 41.3805],
        },
        city: 'Barcelona',
        country: 'Spain',
      },
      ATL: {
        location: {
          coordinates: [-84.4318, 33.641],
        },
        city: 'Atlanta',
        country: 'USA',
      },
    };

    const trip = {
      _id: '12345',
      bizaway_id: '54321',
      type: 'flight',
      cost: 100,
      duration: 3,
      display_name: 'Flight from BCN to ATL',
      origin: 'BCN',
      destination: 'ATL',
    };
    const response = formatResponse(locationCache, trip);
    assert.deepEqual(response, {
      _id: '12345',
      bizaway_id: '54321',
      type: 'flight',
      cost: 100,
      duration: 3,
      display_name: 'Flight from BCN to ATL',
      origin_details: {
        code: 'BCN',
        city: 'Barcelona',
        country: 'Spain',
      },
      destination_details: {
        code: 'ATL',
        city: 'Atlanta',
        country: 'USA',
      },
      cost_per_km: '0.01',
      distance_km: '7363.48',
      carbon_footprint_kg: '662.71',
    });
  });
});
