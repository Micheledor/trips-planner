import { ObjectId } from '@fastify/mongodb';

export async function getFavouriteTrips(mongo, userId) {
  const collection = mongo.db.collection('favourites');

  const result = collection.find(
    { user_ids: { $in: [new ObjectId(userId)] } },
    { projection: { user_ids: 0 } },
  );

  return result.toArray();
};
