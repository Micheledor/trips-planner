const buildURL = (req) => {
  if (req.method === 'GET') {
    const { origin, destination } = req.query;
    return `${process.env.BIZAWAY_API_BASE_URL}?origin=${origin}&destination=${destination}`;
  }
  const { bizaway_id } = req.body;
  return `${process.env.BIZAWAY_API_BASE_URL}/${bizaway_id}`;
};

export function buildConfig(req) {
  return {
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.BIZAWAY_API_KEY,
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
