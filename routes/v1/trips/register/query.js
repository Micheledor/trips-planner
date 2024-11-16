export function getUserByEmail(mongo, email) {
  const collection = mongo.db.collection('users');

  const result = collection.findOne({ email });
  return result;
};

export function createUser(mongo, email, password) {
  const collection = mongo.db.collection('users');

  const result = collection.insertOne({ email, password });
  return result;
}
