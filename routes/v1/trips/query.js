export function addFavouriteTrip(mongo, body) {
  const collection = mongo.db.collection('favourites');

  const result = collection.updateOne(
    { resource_id: body.resource_id },
    { $setOnInsert: body },
    { upsert: true },
  );

  return result;
};