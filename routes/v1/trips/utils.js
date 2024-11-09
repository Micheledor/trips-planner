
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

export function manageErrors(error, res) {
  const errorBody = {};
  console.log('ERROR:: ', error)
  if (error.errno === 1062) {
    errorBody.status = 400;
    errorBody.message = 'This record already exists';
  } else {
    errorBody.status = 500;
    errorBody.message = 'Server error';
  };
  return res.code(errorBody.status).send(errorBody);
};
