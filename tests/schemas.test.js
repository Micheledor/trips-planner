import test from 'node:test';
import assert from 'node:assert';
import { getTripsSchema, postTripSchema } from '.././routes/v1/trips/schema.js';
import { getFavouriteTripsSchema } from '.././routes/v1/trips/favourites/schema.js';
import { deleteFavouriteTripsSchema } from '.././routes/v1/trips/favourites/_id/schema.js';

test('Schemas', async (t) => {
  await t.test('getTripsSchema should validate query', (t) => {
    const query = getTripsSchema.query._getState();
    const { properties, required, type } = query;

    assert.equal(type, 'object');
    assert.deepEqual(required, ['origin', 'destination']);
    assert.equal(properties.length, 5);
    assert.deepEqual(properties[0], { name: 'page', type: 'integer' });
    assert.deepEqual(properties[1], { name: 'limit', type: 'integer' });
    assert.deepEqual(properties[2], { name: 'origin', type: 'string' });
    assert.deepEqual(properties[3], { name: 'destination', type: 'string' });
    assert.deepEqual(properties[4], {
      name: 'sort_by',
      type: 'string',
      pattern: '^(cost|duration)$',
      default: 'cost',
    });
  });

  await t.test('getTripsSchema should validate response', (t) => {
    const response = getTripsSchema.response['200']._getState();
    const { properties, type } = response;
    const data = properties[0].items.properties;

    assert.equal(type, 'object');
    assert.equal(properties.length, 5);
    assert.deepEqual(properties[1], { name: 'page', type: 'integer' });
    assert.deepEqual(properties[2], { name: 'per_page', type: 'integer' });
    assert.deepEqual(properties[3], { name: 'total_elements', type: 'integer' });
    assert.deepEqual(properties[4], { name: 'total_pages', type: 'integer' });
    assert.equal(data.id.type, 'string');
    assert.equal(data.type.type, 'string');
    assert.equal(data.origin.type, 'string');
    assert.equal(data.destination.type, 'string');
    assert.equal(data.cost.type, 'number');
    assert.equal(data.duration.type, 'number');
    assert.equal(data.display_name.type, 'string');
  });

  await t.test('postTripSchema should validate body', (t) => {
    const body = postTripSchema.body._getState();
    const { properties, required, type } = body;

    assert.equal(type, 'object');
    assert.deepEqual(required, ['bizaway_id']);
    assert.equal(properties.length, 1);
    assert.deepEqual(properties[0], { name: 'bizaway_id', type: 'string' });
  });

  await t.test('postTripSchema should validate response', (t) => {
    const response = postTripSchema.response['201']._getState();
    const { properties, type } = response;

    assert.equal(type, 'object');
    assert.equal(properties.length, 9);
    assert.deepEqual(properties[0], { name: '_id', type: 'string' });
    assert.deepEqual(properties[1], { name: 'bizaway_id', type: 'string' });
    assert.deepEqual(properties[2], { name: 'type', type: 'string' });
    assert.deepEqual(properties[3], { name: 'origin', type: 'string' });
    assert.deepEqual(properties[4], { name: 'destination', type: 'string' });
    assert.deepEqual(properties[5], { name: 'cost', type: 'number' });
    assert.deepEqual(properties[6], { name: 'duration', type: 'number' });
    assert.deepEqual(properties[7], { name: 'display_name', type: 'string' });
  });

  await t.test('getFavouriteTripsSchema should validate response', (t) => {
    const response = getFavouriteTripsSchema.response['200']._getState();
    const { items, type } = response;

    assert.equal(type, 'array');
    assert.equal(items.type, 'object');
    assert.equal(items.properties._id.type, 'string');
    assert.equal(items.properties.bizaway_id.type, 'string');
    assert.equal(items.properties.type.type, 'string');
    assert.equal(items.properties.origin.type, 'string');
    assert.equal(items.properties.destination.type, 'string');
    assert.equal(items.properties.cost.type, 'number');
    assert.equal(items.properties.duration.type, 'number');
    assert.equal(items.properties.display_name.type, 'string');
  });

  await t.test('deleteFavouriteTripsSchema should validate params', (t) => {
    const params = deleteFavouriteTripsSchema.params._getState();
    const { properties, required, type } = params;

    assert.equal(type, 'object');
    assert.deepEqual(required, ['id']);
    assert.equal(properties.length, 1);
    assert.deepEqual(properties[0], { name: 'id', type: 'string' });
  });

  await t.test('deleteFavouriteTripsSchema should validate response', (t) => {
    const response = deleteFavouriteTripsSchema.response['200']._getState();
    const { items, type } = response;

    assert.equal(type, 'array');
    assert.equal(items.type, 'object');
    assert.equal(items.properties._id.type, 'string');
    assert.equal(items.properties.bizaway_id.type, 'string');
    assert.equal(items.properties.type.type, 'string');
    assert.equal(items.properties.origin.type, 'string');
    assert.equal(items.properties.destination.type, 'string');
    assert.equal(items.properties.cost.type, 'number');
    assert.equal(items.properties.duration.type, 'number');
    assert.equal(items.properties.display_name.type, 'string');
    assert.equal(items.properties.saved_at.type, 'string');
  });
});
