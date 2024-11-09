import { to } from 'await-to-js';
import { getFavouriteTripsSchema } from './schema.js'
import { getFavouriteTrips } from './query.js';


export default async (fastify) => {
  fastify.get('/', { schema: getFavouriteTripsSchema }, async (req, res) => {
    const [err, trips] = await to(getFavouriteTrips(fastify.mongo));
    if (err) res.code(400).send(err);
    if (trips.length === 0) return res.code(404).send('No favourite trips found')

    res.code(200).send(trips);
  });
};
