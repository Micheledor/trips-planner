export function addFavouriteTrip(mongo, bizaway_id, body) {
  body.bizaway_id = bizaway_id;

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

export function getAirports(mongo, query) {
  const collection = mongo.db.collection('airports');

  const result = collection.find({
    code: {
      $in: [query.origin, query.destination],
    },
  });

  return result.toArray();
};
