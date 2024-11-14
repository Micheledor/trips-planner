export function getSupportedLocations(mongo, query) {
  const collection = mongo.db.collection('locations');

  return collection.find().toArray();
};
