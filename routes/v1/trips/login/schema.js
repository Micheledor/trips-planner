import S from 'fluent-json-schema';

const loginUserSchema = {
  body: S.object()
    .prop('email', S.string().format(S.FORMATS.EMAIL).required())
    .prop('password', S.string().minLength(8).required()),
  response: {
    200:
      S.object()
        .prop('message', S.string())
        .prop('token', S.string()),
  },
};

export { loginUserSchema };
