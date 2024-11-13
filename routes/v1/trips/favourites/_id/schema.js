import S from 'fluent-json-schema';

const deleteFavouriteTripsSchema = {
  params: S.object()
    .prop('id', S.string().required()),
  response: {
    200:
      S.array().items(
        S.object()
          .prop('_id', S.string())
          .prop('bizaway_id', S.string())
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
  deleteFavouriteTripsSchema,
};
