import undici from 'undici';
import { to } from 'await-to-js';
import { postTripsSchema } from './schema.js';
import { addFavouriteTrip } from './query.js';
import { buildConfig } from './utils.js'

export default async (fastify) => {
  fastify.post('/', { schema: postTripsSchema }, async (req, res) => {
    const { bizaway_id } = req.body;
    const requestConfig = buildConfig(req);

    const [_error, bizResponse] = await to(undici.request(requestConfig.url, requestConfig.options));
    const [__error, trip] = await to(bizResponse.body.json());
    if (bizResponse.statusCode !== 200) return res.code(bizResponse.statusCode).send(trip.msg);

    const [error, favouriteTrip] = await to(addFavouriteTrip(fastify.mongo, bizaway_id, trip));
    if (error) res.code(400).send('Error saving favourite trip');

    console.log('Favourite trip added', favouriteTrip);

    return res.code(200).send(favouriteTrip);
  });
};
