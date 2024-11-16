export const getUserByEmail = (mongo, email) => {
  const collection = mongo.db.collection('users');

  const result = collection.findOne({ email });
  return result;
};
