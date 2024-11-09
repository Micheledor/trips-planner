import { to } from 'await-to-js';
import { postTripsSchema } from './schema.js';
import { addFavouriteTrip } from './query.js';
import { formatBody, formatResponse } from './utils.js'

export default async (fastify) => {
  fastify.post('/', { schema: postTripsSchema }, async (req, res) => {
    const body = req.body;
    const formattedBody = formatBody(body);

    const [error, favouriteTrip] = await to(addFavouriteTrip(fastify.mongo, formattedBody));
    if (error) res.code(400).send('Error saving favourite trip');

    const response = formatResponse(favouriteTrip);

    return res.code(201).send(response);
  });
};
