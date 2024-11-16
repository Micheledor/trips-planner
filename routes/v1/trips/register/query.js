export const getUserByEmail = (mongo, email) => {
  const collection = mongo.db.collection('users');

  const result = collection.findOne({ email });
  return result;
};

export const createUser = (mongo, email, password) => {
  const collection = mongo.db.collection('users');

  const result = collection.insertOne({ email, password });
  return result;
}
