
const buildURL = (req) => {
  if (req.method === 'GET') {
    const { origin, destination, sort_by } = req.query;
    return `${process.env.API_BASE_URL}?origin=${origin}&destination=${destination}&sort_by=${sort_by}`;
  }
  const { id } = req.body;
  return `${process.env.API_BASE_URL}/${id}`;
};

export function buildConfig(req) {
  return {
    options: {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY,
      },
    },
    url: buildURL(req),
  };
};

export function sortResponse(trips, query) {
  const { sort_by } = query;
  return sort_by === 'cost' ? trips.sort((a, b) => a.cost - b.cost) : trips.sort((a, b) => a.duration - b.duration);
};

export function formatBody(body) {
  const formattedBody = {
    resource_id: body.id,
    origin: body.origin,
    destination: body.destination,
    cost: body.cost,
    duration: body.duration,
    display_name: body.display_name,
    saved_at: new Date(),
  };
  return formattedBody;
}