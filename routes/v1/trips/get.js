import undici from 'undici';
import { to } from 'await-to-js';
import { getTripsSchema } from './schema.js';
import { buildConfig, sortResponse, generateCacheKey, paginateResponse, setCacheControl, validateLocationQuery } from './utils.js';

let cache = {};

export default async (fastify) => {
  fastify.get('/iamalive', async (_, res) => res.code(200).send('ok'));

  fastify.get('/', { schema: getTripsSchema }, async (req, res) => {
    const { locationCache } = fastify;
    const { query } = req;

    const validationError = validateLocationQuery(query, locationCache);
    if (validationError) return res.code(validationError.code).send({ message: validationError.message });

    const cacheKey = generateCacheKey(query);
    setCacheControl(res);

    if (cache[cacheKey]) return res.code(200).send(cache[cacheKey]);

    const requestConfig = buildConfig(req);

    const [_, bizResponse] = await to(undici.request(requestConfig.url, requestConfig.options));
    const [__, trips] = await to(bizResponse.body.json());
    if (bizResponse.statusCode !== 200) return res.code(bizResponse.statusCode).send({ message: trips.msg });
    if (trips.length === 0) return res.code(404).send({ message: 'No trips found' });

    const sortedTrips = sortResponse(trips, query);

    const paginatedResponse = paginateResponse(sortedTrips, query, trips.length);

    cache[cacheKey] = paginatedResponse;

    return res.code(200).send(paginatedResponse);
  });
};
