import S from 'fluent-json-schema';

const getTripsSchema = {
  query: S.object()
    .prop('origin', S.string().required())
    .prop('destination', S.string().required())
    .prop('sort_by', S.string().pattern(/^(cost|duration)$/).default('cost')),
  response: {
    200:
      S.array().items(
        S.object()
          .prop('id', S.string())
          .prop('type', S.string())
          .prop('origin', S.string())
          .prop('destination', S.string())
          .prop('cost', S.number())
          .prop('duration', S.number())
          .prop('display_name', S.string())
      ),
  },
};

export {
  getTripsSchema,
};
