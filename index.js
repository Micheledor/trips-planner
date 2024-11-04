import createServer from './server.js';

const startServer = async () => {
  const app = await createServer();

  try {
    await app.listen({ port: 3000 });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
