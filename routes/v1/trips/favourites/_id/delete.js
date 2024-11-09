import { to } from 'await-to-js';
import { deleteFavouriteTripsSchema } from './schema.js'
import { removeFavouriteTrip } from './query.js'

export default async (fastify) => {
  fastify.delete('/', { schema: deleteFavouriteTripsSchema }, async (req, res) => {
    const tripId = req.params.id;
    const [err, trips] = await to(removeFavouriteTrip(fastify.mongo, tripId));
    if (err) res.code(400).send(err);
    console.log(trips);
    if (!trips.deletedCount) return res.code(404).send('No favourite trips found');

    res.code(204).send('Trip succesfully deleted');
  });
};
