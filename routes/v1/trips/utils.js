
const buildURL = (req) => {
  if (req.method === 'GET') {
    const { origin, destination, sort_by } = req.query;
    return `${process.env.API_BASE_URL}?origin=${origin}&destination=${destination}&sort_by=${sort_by}`;
  }
  const { bizaway_id } = req.body;
  return `${process.env.API_BASE_URL}/${bizaway_id}`;
};

export function buildConfig(req) {
  return {
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY,
      },
    },
    url: buildURL(req),
  };
};

// Check assigned schema default value
export function sortResponse(trips, query) {
  const { sort_by } = query;
  return sort_by === 'cost' ? trips.sort((a, b) => a.cost - b.cost) : trips.sort((a, b) => a.duration - b.duration);
};

export function generateCacheKey(query) {
  const { origin, destination, ...otherParams } = query;
  const paramsString = Object.entries(otherParams).sort().map(([key, value]) => `${key}=${value}`).join('&');
  return `${origin}-${destination}?${paramsString}`;
};
