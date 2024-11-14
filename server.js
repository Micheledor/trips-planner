import 'dotenv/config';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import mongo from '@fastify/mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadSupportedLocations } from './utils/helpers.js';

let locationCache = {};

export default async function createServer() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const app = fastify({
    logger: true,
  });

  app.decorate('locationCache', locationCache);

  app.register(mongo, {
    forceClose: true,
    maxPoolSize: 10,
    url: process.env.MONGODB_URL,
  });

  app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    routeParams: true,
    dirNameRoutePrefix: true,
    ignorePattern: /.*(schema|test|utils|query).js/,
  });

  await app.ready();
  await loadSupportedLocations(app.mongo, locationCache);

  return app;
};
