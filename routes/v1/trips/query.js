import { ObjectId } from '@fastify/mongodb';

export const addFavouriteTrip = (mongo, bizaway_id, userId, body) => {
  const collection = mongo.db.collection('favourites');
  delete body.id;
  delete body.bizaway_id;


  const result = collection.findOneAndUpdate(
    {
      bizaway_id,
    },
    {
      $set: {
        bizaway_id,
        ...body,
      },
      $addToSet: {
        user_ids: new ObjectId(userId),
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
      projection: { user_ids: 0 },
    },
  );

  return result;
};
