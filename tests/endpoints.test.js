import test from 'node:test';
import assert from 'node:assert';
import { MockAgent } from 'undici';
import { serverSetup, serverTeardown } from './utils.js';
import getFromAtlToBcn from './mocks/getFromAtlToBcn.js';

test('Endpoints', async (t) => {
  let server;
  let mockAgent;
  let mockPool;

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
      .reply(200, getFromAtlToBcn, {});
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

  await t.test('after hook', async () => {
    await mockAgent.close();
    await serverTeardown(server);
  });
});
