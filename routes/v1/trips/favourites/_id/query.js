export async function removeFavouriteTrip(mysql, tripId) {
  const query = `DELETE FROM favourite_trips WHERE id = ?`;
  return mysql.query(query, tripId);
};
