import undici from 'undici';
import { to } from 'await-to-js';
import { postTripSchema } from './schema.js';
import { addFavouriteTrip } from './query.js';
import { buildConfig } from './utils.js'

export default async (fastify) => {
  fastify.post('/', { preHandler: fastify.authenticate, schema: postTripSchema }, async (req, res) => {
    const bizawayId = req.body.bizaway_id;
    const userId = req.user.id;

    const requestConfig = buildConfig(req);

    const [_error, bizResponse] = await to(undici.request(requestConfig.url, requestConfig.options));
    const [__error, trip] = await to(bizResponse.body.json());
    if (bizResponse.statusCode !== 200) return res.code(bizResponse.statusCode).send({ message: trip.msg });

    const [error, favouriteTrip] = await to(addFavouriteTrip(fastify.mongo, bizawayId, userId, trip));
    if (error) return res.code(500).send({ message: error });

    return res.code(200).send(favouriteTrip);
  });
};
