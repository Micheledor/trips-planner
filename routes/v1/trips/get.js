export default async (fastify) => {
  fastify.get('/iamalive', async (req, res) => res.send('ok'));
};