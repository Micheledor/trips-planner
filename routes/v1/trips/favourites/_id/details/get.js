import { to } from 'await-to-js';
import { getDetailedTripSchema } from './schema.js'
import { getFavouriteTrip } from './query.js'
import { formatResponse } from './utils.js'

export default async (fastify) => {
  fastify.get('/', { preHandler: fastify.authenticate, schema: getDetailedTripSchema }, async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;
    const { locationCache } = fastify;

    const [_, trip] = await to(getFavouriteTrip(fastify.mongo, tripId, userId));
    if (!trip) return res.code(404).send('Trip not found');

    const formattedResponse = formatResponse(locationCache, trip);

    return res.code(200).send(formattedResponse);
  });
};
