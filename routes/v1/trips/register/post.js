
import { to } from 'await-to-js';
import { getUserByEmail, createUser } from './query.js';
import { hashPassword } from './utils.js';
import { registerUserSchema } from './schema.js';

export default async (fastify) => {
  fastify.post('/', { schema: registerUserSchema }, async (req, res) => {
    const { email, password } = req.body;

    const [error, user] = await to(getUserByEmail(fastify.mongo, email));
    if (error) return res.code(400).send('Error fetching user');
    if (user) return res.code(400).send('User already exists');

    const [_, hashedPassword] = await to(hashPassword(password));

    const [createError, newUser] = await to(createUser(fastify.mongo, email, hashedPassword));
    if (createError) return res.code(400).send('Error creating user');

    const token = fastify.jwt.sign({ username: newUser.username });

    return res.code(201).send({ message: 'Successful registration' });
  });
};
