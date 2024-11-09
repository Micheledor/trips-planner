export async function removeFavouriteTrip(mongo, tripId) {
  const collection = mongo.db.collection('favourites');

  const result = collection.deleteOne({ resource_id: tripId });
  return result;
};
