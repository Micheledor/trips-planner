const buildURL = (req) => {
  if (req.method === 'GET') {
    const { origin, destination } = req.query;
    return `${process.env.BIZAWAY_API_BASE_URL}?origin=${origin}&destination=${destination}`;
  }
  const { bizaway_id } = req.body;
  return `${process.env.BIZAWAY_API_BASE_URL}/${bizaway_id}`;
};

export const buildConfig = (req) => {
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

export const sortResponse = (trips, query) => {
  const { sort_by } = query;
  return sort_by === 'cost' ? trips.sort((a, b) => a.cost - b.cost) : trips.sort((a, b) => a.duration - b.duration);
};

export const generateCacheKey = (query) => {
  const { origin, destination, ...otherParams } = query;
  const paramsString = Object.entries(otherParams).sort().map(([key, value]) => `${key}=${value}`).join('&');
  return `${origin}-${destination}?${paramsString}`;
};

export const paginateResponse = (trips, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.per_page) || 10;

  const totalResults = trips.length;
  const paginatedData = trips.slice((page - 1) * limit, page * limit);
  return {
    data: paginatedData,
    page,
    per_page: limit,
    total_elements: totalResults,
    total_pages: Math.ceil(totalResults / limit),
  };
};

export const setCacheControl = (res, maxAge = 3600) => {
  res.header('cache-control', `max-age=${maxAge}`);
};

export const validateLocationQuery = (query, locationCache) => {
  if (query.origin === query.destination) return { code: 400, message: 'Origin and destination cannot be the same' };
  if (!locationCache[query.origin]) return { code: 400, message: 'Invalid origin' };
  if (!locationCache[query.destination]) return { code: 400, message: 'Invalid destination' };
  return null;
};