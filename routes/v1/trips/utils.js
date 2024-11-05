export function buildURL(query) {
  const { origin, destination, sort_by } = query;
  return `${process.env.API_BASE_URL}?origin=${origin}&destination=${destination}&sort_by=${sort_by}`;
};

export function buildOptions() {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
    },
  };
};

export function sortResponse(trips, query) {
  const { sort_by } = query;
  return sort_by === 'cost' ? trips.sort((a, b) => a.cost - b.cost) : trips.sort((a, b) => a.duration - b.duration);
};
