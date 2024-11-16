import { to } from 'await-to-js';
import { getUserByEmail } from './query.js';
import { checkPassword } from './utils.js';

export default async (fastify) => {
  fastify.post('/', async (req, res) => {

    const { email, password } = req.body;

    const [err, user] = await to(getUserByEmail(fastify.mongo, email));
    if (err) res.code(500).send({ error: 'Internal Server Error' });
    if (!user) res.code(401).send({ error: 'Unauthorized' });

    const [passwordErr, isPasswordCorrect] = await to(checkPassword(password, user.password));
    if (passwordErr) res.code(500).send({ error: 'Internal Server Error' });
    if (!isPasswordCorrect) res.code(401).send({ error: 'Unauthorized' });

    const token = fastify.jwt.sign({ email });

    res.code(200).send({ message: 'Succesful login', token });
  });
};
