import 'dotenv/config';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import fastifyJwt from '@fastify/jwt';
import mongo from '@fastify/mongodb';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
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
  app.decorate('authenticate', verifyJwt);

  app.register(cors);

  app.register(swagger, {
    host: 'localhost:3000',
    basePath: '/v1/trips',
    routePrefix: '/documentation',
    exposeRoute: true,
    openapi: {
      info: {
        title: 'Trips Planner API',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000/v1/trips',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  // Register Swagger UI
  app.register(swaggerUi, {
    routePrefix: '/documentation', // Matches the documentation path
    exposeRoute: true,
    staticCSP: true, // Ensures static assets are served correctly
    transformStatic: false, // Prevents additional transformations of static routes
    uiConfig: {
      deepLinking: true,
    },
    openapi: {
      info: {
        title: 'Trips Planner API',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000/v1/trips', // Matches base path
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
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
