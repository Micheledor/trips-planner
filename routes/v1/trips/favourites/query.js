export async function getFavouriteTrips(mongo) {
  const collection = mongo.db.collection('favourites');

  const result = collection.find({});
  return result.toArray();
};
