import { ObjectId } from '@fastify/mongodb';

export async function removeFavouriteTrip(mongo, tripId) {
  const collection = mongo.db.collection('favourites');

  const result = collection.deleteOne({ _id: new ObjectId(tripId) });
  return result;
};
