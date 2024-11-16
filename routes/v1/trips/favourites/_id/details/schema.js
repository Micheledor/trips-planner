import S from 'fluent-json-schema';

const getDetailedTripSchema = {
  params: S.object()
    .prop('id', S.string().required()),
  response: {
    200:
      S.object()
        .prop('_id', S.string())
        .prop('bizaway_id', S.string())
        .prop('type', S.string())
        .prop('cost', S.number())
        .prop('duration', S.number())
        .prop('display_name', S.string())
        .prop('origin_details', S.object()
          .prop('code', S.string())
          .prop('city', S.string())
          .prop('country', S.string()))
        .prop('destination_details', S.object()
          .prop('code', S.string())
          .prop('city', S.string())
          .prop('country', S.string()))
        .prop('cost_per_km', S.number())
        .prop('distance_km', S.number())
        .prop('carbon_footprint_kg', S.number())
  },
};

export {
  getDetailedTripSchema,
};
