import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert';
import fastify from 'fastify';
import mongo from '@fastify/mongodb';
import { to } from 'await-to-js';
import { addFavouriteTrip } from '../routes/v1/trips/query.js';

let server;

const setup = async () => {
  server = fastify();
  server.register(mongo, {
    forceClose: true,
    maxPoolSize: 10,
    url: process.env.MONGODB_URL_TEST,
  });

  await server.listen({ port: 4000, host: '0.0.0.0' })
};

const teardown = async () => {
  await server.close();
};

test('addFavouriteTrip', async () => {
  await setup();

  const [err, result] = await to(addFavouriteTrip(server.mongo, '330b236d-5f45-42ac-8e89-739b729e4b30', {}));
  assert.strictEqual(err, null);

  await teardown();
});
