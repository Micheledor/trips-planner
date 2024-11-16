import { to } from 'await-to-js';
import { getSupportedLocations } from './query.js';

export async function loadSupportedLocations(mongo, locationCache) {
  const [error, locations] = await to(getSupportedLocations(mongo));
  if (error) throw error;

  locations.forEach((location) => locationCache[location.code] = location);
};
