import { to } from 'await-to-js';

export async function setupDatabase(mysql) {
  const query = `
    CREATE TABLE IF NOT EXISTS favourite_trips (
      id INT PRIMARY KEY,
      service_id VARCHAR(255),
      type VARCHAR(255),
      origin VARCHAR(255),
      destination VARCHAR(255),
      cost INT,
      duration INT,
      display_name VARCHAR(255),
      saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const [err, _] = await to(mysql.query(query));
  if (err) throw new Error(`Database setup error: ${err.message}`);
};
