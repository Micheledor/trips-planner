import S from 'fluent-json-schema';

const getTripsSchema = {
  query: S.object()
    .prop('page', S.integer())
    .prop('limit', S.integer())
    .prop('origin', S.string().required())
    .prop('destination', S.string().required())
    .prop('sort_by', S.string().pattern(/^(cost|duration)$/).default('cost')),
  response: {
    200:
      S.object()
        .prop('data', S.array().items(
          S.object()
            .prop('id', S.string())
            .prop('type', S.string())
            .prop('origin', S.string())
            .prop('destination', S.string())
            .prop('cost', S.number())
            .prop('duration', S.number())
            .prop('display_name', S.string())
        ))
        .prop('page', S.integer())
        .prop('per_page', S.integer())
        .prop('total_elements', S.integer())
        .prop('total_pages', S.integer()),
  },
};

const postTripSchema = {
  security: [{ bearerAuth: [] }],
  body: S.object()
    .prop('bizaway_id', S.string().required()),
  response: {
    200:
      S.object()
        .prop('_id', S.string())
        .prop('bizaway_id', S.string())
        .prop('type', S.string())
        .prop('origin', S.string())
        .prop('destination', S.string())
        .prop('cost', S.number())
        .prop('duration', S.number())
        .prop('display_name', S.string()),
  },
};

export {
  getTripsSchema,
  postTripSchema,
};
