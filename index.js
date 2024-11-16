import createServer from './server.js';

const startServer = async () => {
  const app = await createServer();

  try {
    app.listen({ port: process.env.PORT, host: '0.0.0.0' });
    console.log(`Server listening at http://0.0.0.0:${process.env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
