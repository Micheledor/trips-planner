import undici from 'undici';
import { to } from 'await-to-js';
import { getTripsSchema } from './schema.js';
import { buildConfig, sortResponse, generateCacheKey } from './utils.js';

let cache = {};

export default async (fastify) => {
  fastify.get('/iamalive', async (_, res) => res.code(200).send('ok'));

  fastify.get('/', { schema: getTripsSchema }, async (req, res) => {
    const { query } = req;
    const { locationCache } = fastify;

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.per_page) || 10;

    if (query.origin === query.destination) return res.code(400).send('Origin and destination cannot be the same');
    if (!locationCache[query.origin]) return res.code(400).send('Invalid origin');
    if (!locationCache[query.destination]) return res.code(400).send('Invalid destination');

    const cacheKey = generateCacheKey(query);
    res.header('cache-control', 'max-age=3600');

    if (cache[cacheKey]) {
      return res.code(200).send(cache[cacheKey]);
    }

    const requestConfig = buildConfig(req);

    const [_, bizResponse] = await to(undici.request(requestConfig.url, requestConfig.options));
    const [__, trips] = await to(bizResponse.body.json());
    if (bizResponse.statusCode !== 200) return res.code(bizResponse.statusCode).send(trips.msg);

    const sortedTrips = sortResponse(trips, query);

    const totalResults = sortedTrips.length;
    const paginatedData = sortedTrips.slice((page - 1) * limit, page * limit);

    const paginatedResponse = {
      data: paginatedData,
      page,
      per_page: limit,
      total_elements: totalResults,
      total_pages: Math.ceil(totalResults / limit),
    };

    cache[cacheKey] = paginatedResponse;

    res.code(200).send(paginatedResponse);
  });
};
