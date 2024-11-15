import fastify from 'fastify';
import mongo from '@fastify/mongodb';

export async function queriesSetup() {
  const server = fastify();
  server.register(mongo, {
    forceClose: true,
    maxPoolSize: 10,
    url: process.env.MONGODB_URL_TEST,
  });
  await server.listen({ port: 0, host: '0.0.0.0' });
  return server;
};

export async function queriesTeardown(server) {
  await server.close();
};
