import { to } from 'await-to-js';

export async function setupDatabase(mysql) {
  const query = `
      CREATE TABLE IF NOT EXISTS trips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        origin VARCHAR(3) NOT NULL,
        destination VARCHAR(3) NOT NULL,
        cost DECIMAL(10, 2) NOT NULL,
        duration INT NOT NULL
      )
    `;

  const [err, _] = await to(mysql.query(query));
  if (err) throw Error(err);
};
