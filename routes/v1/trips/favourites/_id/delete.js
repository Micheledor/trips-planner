import { to } from 'await-to-js';
import { deleteFavouriteTripsSchema } from './schema.js'
import { removeFavouriteTrip } from './query.js'

export default async (fastify) => {
  fastify.delete('/', { preHandler: fastify.authenticate, schema: deleteFavouriteTripsSchema }, async (req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;

    const [err, _] = await to(removeFavouriteTrip(fastify.mongo, tripId, userId));
    if (err) return res.code(500).send({ message: err });

    return res.code(204).send('Trip succesfully deleted');
  });
};
