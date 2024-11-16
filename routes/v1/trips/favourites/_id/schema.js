import S from 'fluent-json-schema';

const deleteFavouriteTripsSchema = {
  params: S.object()
    .prop('id', S.string().required()),
  response: {
    204: S.null(),
  },
};

export {
  deleteFavouriteTripsSchema,
};
