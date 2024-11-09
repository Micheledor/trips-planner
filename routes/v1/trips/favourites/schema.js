import S from 'fluent-json-schema';

const getFavouriteTripsSchema = {
  // Potentially useful to add some queryparams here, like a sort_by
  response: {
    200:
      S.array().items(
        S.object()
          .prop('_id', S.string())
          .prop('resource_id', S.string())
          .prop('type', S.string())
          .prop('origin', S.string())
          .prop('destination', S.string())
          .prop('cost', S.number())
          .prop('duration', S.number())
          .prop('display_name', S.string())
          .prop('saved_at', S.string())
      ),
  },
};

export {
  getFavouriteTripsSchema,
};