import { to } from 'await-to-js';
import { getSupportedLocations } from './query.js';

export async function loadSupportedLocations(mongo, locationCache) {
  const [error, locations] = await to(getSupportedLocations(mongo));
  if (error) throw error;

  locations.forEach((location) => locationCache[location.code] = location);
};

export async function verifyJwt(req, res) {
  const [err, response] = await to(req.jwtVerify());
  if (err || !response) return res.code(401).send({ message: 'Unauthorized' });
  return response;
};
