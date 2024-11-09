import { to } from 'await-to-js';
import { postTripsSchema } from './schema.js';
import { addFavouriteTrip } from './query.js';
import { manageErrors } from './utils.js'

export default async (fastify) => {
  fastify.post('/', { schema: postTripsSchema }, async (req, res) => {
    const body = req.body;

    const [error, _] = await to(addFavouriteTrip(fastify.mysql, body));
    if (error) return manageErrors(error, res);

    return res.code(204);
  });
};
