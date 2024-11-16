import { ObjectId } from '@fastify/mongodb';

export async function removeFavouriteTrip(mongo, tripId, userId) {
  const collection = mongo.db.collection('favourites');

  const result = await collection.findOneAndUpdate(
    {
      _id: new ObjectId(tripId),
      user_ids: { $in: [new ObjectId(userId)] },
    },
    {
      $pull: { user_ids: new ObjectId(userId) },
    },
    { returnDocument: 'after' },
  );

  if (!result) throw Error('Trip not found');
  if (result.user_ids.length === 0) await collection.deleteOne({ _id: new ObjectId(tripId) });

  return result;
};
