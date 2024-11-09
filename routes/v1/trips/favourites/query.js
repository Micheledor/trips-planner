export async function getFavouriteTrips(mysql) {
  const query = `
    SELECT
      id,
      type,
      origin,
      destination,
      cost,
      duration,
      display_name,
      DATE_FORMAT(saved_at, '%Y-%m-%d %H:%i:%s') AS saved_at
    FROM favourite_trips
  `;

  const [rows] = await mysql.query(query);
  return rows;
};
