# Getting started:

1. **Download the repository** from Github: `git clone git@github.com:Micheledor/trips-planner.git`
2. Navigate to this **project's directory**: `cd ./path-to-this-repo/trips-planner`
3. Install **NPM packages**: `npm install`
4. Make sure to copy the provided **.env** in the project's root directory.
5. You're good to go: **Start the server**: `npm run start`
6. You can start making requests using a test tool like Postman. You will see the **server address** in the console, by default the server uses port 3000, you can change it by modifying the .env `PORT` variable.

# Endpoints documentation:

Once you start the server, the endpoints documentation will be available browsing to `localhost:{port}/documentation`.

# Chosen stack: Why?
- **Fastify**: Faster, easy and cleaner compared to frameworks like Express.
- **MongoDB**: I am using a Cluster where I host a db (trips) with 3 collections: **users, favourites, locations**.
