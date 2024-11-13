export function addFavouriteTrip(mongo, bizaway_id, body) {
  const collection = mongo.db.collection('favourites');

  const result = collection.findOneAndUpdate(
    {
      bizaway_id,
    },
    {
      $set: {
        bizaway_id,
        ...body,
      },
      $setOnInsert: { created_at: new Date() },
    },
    {
      upsert: true,
      returnDocument: 'after',
    },
  );
  return result;
};
