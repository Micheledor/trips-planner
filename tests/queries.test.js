import 'dotenv/config';
import test, { before, after } from 'node:test';
import assert from 'node:assert';
import fastify from 'fastify';
import mongo from '@fastify/mongodb';
import { ObjectId } from '@fastify/mongodb';
import { to } from 'await-to-js';
import { getSupportedLocations } from '../utils/query.js';
import { addFavouriteTrip } from '../routes/v1/trips/query.js';
import { getFavouriteTrips } from '../routes/v1/trips/favourites/query.js';
import { removeFavouriteTrip } from '../routes/v1/trips/favourites/_id/query.js';

const setup = async () => {
  const server = fastify();
  server.register(mongo, {
    forceClose: true,
    maxPoolSize: 10,
    url: process.env.MONGODB_URL_TEST,
  });
  await server.listen({ port: 0, host: '0.0.0.0' });
  return server;
};

const teardown = async (server) => {
  await server.close();
};

test('Queries', async (t) => {
  let server;
  const existingTripId = '673686db58cf06bdf1320b12';
  let newTripId;

  await t.test('before hook', async () => {
    server = await setup();
  });

  await t.test('getSupportedLocations should return all locations', async () => {
    const [err, result] = await to(
      getSupportedLocations(server.mongo)
    );

    assert.strictEqual(err, null);
    assert.strictEqual(result.length, 50);
  });

  await t.test('addFavouriteTrip should update existing trip', async () => {
    const [err, result] = await to(
      addFavouriteTrip(
        server.mongo,
        '330b236d-5f45-42ac-8e89-739b729e4b30',
        {
          origin: 'ARN',
          destination: 'ATL',
          cost: 3799,
          duration: 21,
          display_name: 'from ARN to ATL by train',
          type: 'train',
        }
      ),
    );

    assert.strictEqual(err, null);
    assert.equal(result._id.toString(), existingTripId,);
  });

  await t.test('addFavouriteTrip should create trip if not existing', async () => {
    const [err, result] = await to(
      addFavouriteTrip(
        server.mongo,
        '0af6ee7b-fe9a-40f7-adfe-42522c3d7eb9',
        {
          origin: 'ATL',
          destination: 'BCN',
          cost: 2996,
          duration: 32,
          display_name: 'from ATL to BCN by train',
          type: 'train',
        }
      ),
    );

    newTripId = result._id;

    assert.strictEqual(err, null);
    assert.strictEqual(result.origin, 'ATL');
    assert.strictEqual(result.destination, 'BCN');
    assert.strictEqual(result.cost, 2996);
    assert.strictEqual(result.duration, 32);
    assert.strictEqual(result.display_name, 'from ATL to BCN by train');
    assert.strictEqual(result.type, 'train');
  });

  await t.test('getFavouriteTrips should return all trips', async () => {
    const [err, result] = await to(
      getFavouriteTrips(server.mongo)
    );

    const tripIds = result.map((trip) => trip._id.toString());

    assert.strictEqual(err, null);
    assert.strictEqual(result.length, 2);
    assert.ok(tripIds.includes(existingTripId));
    assert.ok(tripIds.includes(newTripId.toString()));
  });

  await t.test('removeFavouriteTrip should remove trip', async () => {
    const [err, result] = await to(
      removeFavouriteTrip(server.mongo, newTripId)
    );

    assert.strictEqual(err, null);
    assert.strictEqual(result.deletedCount, 1);
  });

  await t.test('after hook', async () => {
    await teardown(server);
  });
});
