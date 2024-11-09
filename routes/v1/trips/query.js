export function addFavouriteTrip(mysql, body) {

  const updateBody = {
    ...body,
    saved_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
  };

  const query = `INSERT INTO favourite_trips SET ?`;
  return mysql.query(query, updateBody);
};
