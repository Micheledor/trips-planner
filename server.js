import 'dotenv/config';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import fastifyJwt from '@fastify/jwt';
import mongo from '@fastify/mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadSupportedLocations, verifyJwt } from './utils/helpers.js';

let locationCache = {};
const mongoUrl = process.env.APP_ENV === 'test' ? process.env.MONGODB_URL_TEST : process.env.MONGODB_URL_STAG;

export default async function createServer() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const app = fastify({
    logger: process.env.APP_ENV === 'stag',
  });

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });

  app.register(mongo, {
    forceClose: true,
    maxPoolSize: 10,
    url: mongoUrl,
  });

  app.decorate('locationCache', locationCache);

  app.decorate('authorize', verifyJwt);

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
