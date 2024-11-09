import 'dotenv/config';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import mongo from '@fastify/mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

export default async function createServer() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const app = fastify({
    logger: true,
  });

  app.register(mongo, () => {
    return {
      forceClose: true,
      maxPoolSize: 10,
      url: process.env.MONGODB_URL,
    };
  });

  app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    routeParams: true,
    dirNameRoutePrefix: true,
    ignorePattern: /.*(schema|test|utils|query).js/,
  });

  return app;
};
