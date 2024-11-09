import { to } from 'await-to-js';
import { removeFavouriteTrip } from './query.js'

export default async (fastify) => {
  fastify.delete('/', async (req, res) => {
    const tripId = req.params.id;
    const [err, trips] = await to(removeFavouriteTrip(fastify.mysql, tripId));
    if (err) res.code(400).send(err);
    if (!trips) return res.code(404).send('No favourite trips found');

    res.code(204).send('Trip succesfully deleted');
  });
};
