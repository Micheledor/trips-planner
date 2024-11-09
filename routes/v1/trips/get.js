import undici from 'undici';
import { to } from 'await-to-js';
import { getTripsSchema } from './schema.js';
import { buildConfig, sortResponse, generateCacheKey } from './utils.js';
import { getAirports } from './query.js';

let cache = {};

export default async (fastify) => {
  fastify.get('/iamalive', async (_, res) => res.code(200).send('ok'));

  fastify.get('/', { schema: getTripsSchema }, async (req, res) => {
    const { query } = req;

    const cacheKey = generateCacheKey(query);
    res.header('cache-control', 'max-age=3600');
    if (cache[cacheKey]) {
      return res.code(200).send(cache[cacheKey]);
    }

    const [airportsError, airports] = await to(getAirports(fastify.mongo, query));
    if (airportsError) res.code(500).send(airportsError);
    if (airports.length !== 2) res.code(400).send('Invalid origin or destination');

    const requestConfig = buildConfig(req);

    const [apiError, apiResponse] = await to(undici.request(requestConfig.url, requestConfig.options));
    if (apiError) res.code(500).send(apiError);

    const [tripsError, trips] = await to(apiResponse.body.json());
    if (tripsError) res.code(500).send(tripsError);

    const response = sortResponse(trips, query);

    cache[cacheKey] = response;

    res.code(200).send(response);
  });
};
