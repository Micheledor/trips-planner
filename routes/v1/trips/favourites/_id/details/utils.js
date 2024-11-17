
const haversineDistance = (locationCache, trip) => {
  const origin = {
    lat: locationCache[trip.origin]?.location?.coordinates[1],
    lon: locationCache[trip.origin]?.location?.coordinates[0],
  };

  const destination = {
    lat: locationCache[trip.destination]?.location?.coordinates[1],
    lon: locationCache[trip.destination]?.location?.coordinates[0],
  };

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371;
  const dLat = toRadians(destination.lat - origin.lat);
  const dLon = toRadians(destination.lon - origin.lon);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(origin.lat)) *
    Math.cos(toRadians(destination.lat)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(2);
};

const carbonEmission = (distance, vehicle) => {
  const emissionFactors = {
    flight: 0.090,
    car: 0.192,
    train: 0.041,
  };

  const emissionFactor = emissionFactors[vehicle];
  return (distance * emissionFactor).toFixed(2);
};

export const formatResponse = (locationCache, trip) => {
  const distance = haversineDistance(locationCache, trip);
  const carbonFootprint = carbonEmission(distance, trip.type);

  return {
    _id: trip._id,
    bizaway_id: trip.bizaway_id,
    type: trip.type,
    cost: trip.cost,
    duration: trip.duration,
    display_name: trip.display_name,
    origin_details: {
      code: trip.origin,
      city: locationCache[trip.origin].city,
      country: locationCache[trip.origin].country,
    },
    destination_details: {
      code: trip.destination,
      city: locationCache[trip.destination].city,
      country: locationCache[trip.destination].country,
    },
    cost_per_km: (trip.cost / distance).toFixed(2),
    distance_km: distance,
    carbon_footprint_kg: carbonFootprint,
  };
};
