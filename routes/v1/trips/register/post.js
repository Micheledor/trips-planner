
import { to } from 'await-to-js';
import { getUserByEmail, createUser } from './query.js';
import { hashPassword } from './utils.js';
import { registerUserSchema } from './schema.js';

export default async (fastify) => {
  fastify.post('/', { schema: registerUserSchema }, async (req, res) => {
    const { email, password } = req.body;

    const [error, user] = await to(getUserByEmail(fastify.mongo, email));
    if (error) return res.code(500).send({ message: 'Internal Server Error' });
    if (user) return res.code(409).send({ message: 'User already exists' });

    const [_, hashedPassword] = await to(hashPassword(password));

    const [createError, newUser] = await to(createUser(fastify.mongo, email, hashedPassword));
    if (createError) return res.code(500).send({ message: 'Internal Server Error' });

    const token = fastify.jwt.sign({ username: newUser.username });

    return res.code(201).send({ message: 'Successful registration' });
  });
};
