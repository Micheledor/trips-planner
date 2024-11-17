import { to } from 'await-to-js';
import { getFavouriteTripsSchema } from './schema.js'
import { getFavouriteTrips } from './query.js';


export default async (fastify) => {
  fastify.get('/', { preHandler: fastify.authorize, schema: getFavouriteTripsSchema }, async (req, res) => {
    const userId = req.user.id;

    const [err, trips] = await to(getFavouriteTrips(fastify.mongo, userId));
    if (err) return res.code(500).send({ message: 'Internal Server Error' });
    if (trips.length === 0) return res.code(404).send({ message: 'No favourite trips found' });

    return res.code(200).send(trips);
  });
};
