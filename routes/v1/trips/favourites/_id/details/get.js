import { to } from 'await-to-js';
import { getDetailedTripSchema } from './schema.js'
import { getFavouriteTrip } from './query.js'
import { haversineDistance, carbonEmission, formatResponse } from './utils.js'

export default async (fastify) => {
  fastify.get('/', { preHandler: fastify.authorize, schema: getDetailedTripSchema }, async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;
    const { locationCache } = fastify;

    const [err, trip] = await to(getFavouriteTrip(fastify.mongo, tripId, userId));
    if (!trip) return res.code(404).send('Trip not found');

    const distanceKm = haversineDistance(locationCache, trip);
    const carbonFootprintKg = carbonEmission(distanceKm, trip.type);

    const formattedResponse = formatResponse(locationCache, trip, distanceKm, carbonFootprintKg);


    return res.code(200).send(formattedResponse);
  });
};
