import undici from 'undici';
import { to } from 'await-to-js';
import { getTripsSchema } from './schema.js';
import { buildURL, buildOptions, sortResponse } from './utils.js';

export default async (fastify) => {
  fastify.get('/iamalive', async (_, res) => res.code(200).send('ok'));

  fastify.get('/', { schema: getTripsSchema }, async (req, res) => {
    const { query } = req;

    const url = buildURL(query);
    const options = buildOptions();

    const [apiError, apiResponse] = await to(undici.request(url, options));
    if (apiError) res.code(500).send(apiError);

    const [tripsError, trips] = await to(apiResponse.body.json());
    if (tripsError) res.code(500).send(tripsError);

    const response = sortResponse(trips, query);

    res.code(200).send(response);
  });
};
