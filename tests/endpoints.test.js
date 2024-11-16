import test from 'node:test';
import assert from 'node:assert';
import { MockAgent } from 'undici';
import { ObjectId } from '@fastify/mongodb';
import { serverSetup, serverTeardown } from './utils.js';
import getFromAtlToBcn from './mocks/getFromAtlToBcn.js';
import postFromArnToAtl from './mocks/postFromArnToAtl.js';
import postFromBcnToDel from './mocks/postFromBcnToDel.js';

test('Endpoints', async (t) => {
  let server;
  let mockAgent;
  let mockPool;
  let createdTripId;
  let bearerToken;

  await t.test('before hook', async () => {
    server = await serverSetup();

    mockAgent = new MockAgent();
    const baseUrl = new URL(process.env.BIZAWAY_API_BASE_URL);
    mockPool = mockAgent.get(baseUrl.origin);

    mockPool
      .intercept({
        path: `${baseUrl.pathname}?origin=BCN&destination=ATL`,
        method: 'GET',
      })
      .reply(200, getFromAtlToBcn);

    mockPool
      .intercept({
        path: `${baseUrl.pathname}/330b236d-5f45-42ac-8e89-739b729e4b30`,
        method: 'GET',
      })
      .reply(200, postFromArnToAtl);

    mockPool
      .intercept({
        path: `${baseUrl.pathname}/7ec09a82-547f-4a8c-b4bb-4902fa49d43d`,
        method: 'GET',
      })
      .reply(200, postFromBcnToDel);
  });

  await t.test('POST registration', async (t) => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/trips/register',
      payload: {
        email: 'michele.test@gmail.com',
        password: 'password',
      },
    });


    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(JSON.parse(response.payload).message, 'Successful registration');
  });

  await t.test('POST login - wrong password', async (t) => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/trips/login',
      payload: {
        email: 'michele.test@gmail.com',
        password: 'wrongpassword',
      },
    });

    assert.strictEqual(response.statusCode, 401);
  });

  await t.test('POST login', async (t) => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/trips/login',
      payload: {
        email: 'michele.test@gmail.com',
        password: 'password',
      },
    });

    assert.strictEqual(response.statusCode, 200);
    assert.ok(response.payload.includes('token'));

    bearerToken = JSON.parse(response.payload).token;
  });

  await t.test('GET trips', async (t) => {
    const response = await server.inject({
      method: 'GET',
      url: '/v1/trips?origin=BCN&destination=ATL',
    });

    const expectedResponse = {
      data: getFromAtlToBcn,
      page: 1,
      per_page: 10,
      total_elements: getFromAtlToBcn.length,
      total_pages: 1,
    };

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(response.payload), expectedResponse);
  });

  await t.test('POST trip - wrong bizAway id', async (t) => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/trips',
      headers: { Authorization: `Bearer ${bearerToken}` },
      payload: {
        bizaway_id: 'wrong-id',
      },
    });

    assert.strictEqual(response.statusCode, 400);
  });

  await t.test('POST trip - no token', async (t) => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/trips',
      payload: {
        bizaway_id: '330b236d-5f45-42ac-8e89-739b729e4b30',
      },
    });

    assert.strictEqual(response.statusCode, 401);
  });

  await t.test('POST trip - update', async (t) => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/trips',
      headers: { Authorization: `Bearer ${bearerToken}` },
      payload: {
        bizaway_id: '330b236d-5f45-42ac-8e89-739b729e4b30',
      },
    });

    const expectedResponse = {
      _id: '673686db58cf06bdf1320b12',
      bizaway_id: '330b236d-5f45-42ac-8e89-739b729e4b30',
      cost: 3799,
      destination: 'ATL',
      display_name: 'from ARN to ATL by train',
      duration: 21,
      origin: 'ARN',
      type: 'train',
    };

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(response.payload), expectedResponse);
  });

  await t.test('POST trip - create', async (t) => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/trips',
      headers: { Authorization: `Bearer ${bearerToken}` },
      payload: {
        bizaway_id: '7ec09a82-547f-4a8c-b4bb-4902fa49d43d',
      },
    });

    const expectedResponse = {
      _id: '673686db58cf06bdf1320b12',
      bizaway_id: '7ec09a82-547f-4a8c-b4bb-4902fa49d43d',
      cost: 2634,
      destination: 'DEL',
      display_name: 'from BCN to DEL by car',
      duration: 1,
      origin: 'BCN',
      type: 'car',
    };

    const responsePayload = JSON.parse(response.payload);
    createdTripId = responsePayload._id;
    expectedResponse._id = createdTripId;

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(responsePayload, expectedResponse);
  });

  await t.test('GET favourite trips - no token', async (t) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/trips/favourites`,
    });

    assert.strictEqual(response.statusCode, 401);
  });

  await t.test('GET favourite trips', async (t) => {
    const response = await server.inject({
      method: 'GET',
      url: '/v1/trips/favourites',
      headers: { Authorization: `Bearer ${bearerToken}` },
    });

    const expectedResponse = [
      {
        _id: '673686db58cf06bdf1320b12',
        bizaway_id: '330b236d-5f45-42ac-8e89-739b729e4b30',
        type: 'train',
        origin: 'ARN',
        destination: 'ATL',
        cost: 3799,
        duration: 21,
        display_name: 'from ARN to ATL by train',
      },
      {
        _id: createdTripId,
        bizaway_id: '7ec09a82-547f-4a8c-b4bb-4902fa49d43d',
        type: 'car',
        origin: 'BCN',
        destination: 'DEL',
        cost: 2634,
        duration: 1,
        display_name: 'from BCN to DEL by car',
      }];

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(response.payload), expectedResponse);
  });

  await t.test('DELETE favourite trip - no token', async (t) => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/v1/trips/favourites/${createdTripId}`,
    });

    assert.strictEqual(response.statusCode, 401);
  });

  await t.test('DELETE favourite trip', async (t) => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/v1/trips/favourites/673686db58cf06bdf1320b12`,
      headers: { Authorization: `Bearer ${bearerToken}` },
    });

    assert.strictEqual(response.statusCode, 204);
  });

  await t.test('after hook', async () => {
    await server.mongo.db.collection('users').findOneAndDelete({ email: 'michele.test@gmail.com' });
    await server.mongo.db.collection('favourites').findOneAndDelete({ _id: new ObjectId(createdTripId) });
    await mockAgent.close();
    await serverTeardown(server);
  });
});
