import 'dotenv/config';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import mysql from '@fastify/mysql';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupDatabase } from './setup.js';

export default async function createServer() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const app = fastify({
    logger: true,
  });

  await app.register(mysql, {
    connectionString: process.env.MYSQL_URL,
    promise: true,
  });

  await setupDatabase(app.mysql);

  app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    routeParams: true,
    dirNameRoutePrefix: true,
    ignorePattern: /.*(schema|test|utils).js/,
  });

  return app;
};
