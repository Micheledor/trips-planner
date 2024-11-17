import { ObjectId } from '@fastify/mongodb';

export const getFavouriteTrip = async (mongo, tripId, userId) => {
  const collection = mongo.db.collection('favourites');

  const result = await collection.findOne({
    _id: new ObjectId(tripId),
    user_ids: { $in: [new ObjectId(userId)] },
  });

  return result;
};
