import createServer from './server.js';

const startServer = async () => {
  const app = await createServer();

  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening at http://0.0.0.0:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
