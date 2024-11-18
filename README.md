# Getting started:
1. **Download the repository** from Github: `git clone git@github.com:Micheledor/trips-planner.git`
2. Navigate to this **project's directory**: `cd ./path-to-this-repo/trips-planner`
3. Install **NPM packages**: `npm install`
4. Make sure to copy the provided **.env** in the project's root directory.
5. You're good to go: **Start the server**: `npm run start`
6. You can start making requests using a test tool like Postman. You will see the **server address** in the console, by default the server uses port 3000, you can change it by modifying the .env `PORT` variable.
7. To interact with the following routes:
  - POST favourite trip
  - GET favourite trips
  - GET detailed view of favourite trip
  - DELETE favourite trip
  You will need to register and login(/register, /login), then pass the Bearer Token in the request's headers.

# Endpoints documentation:
Once you start the server, the endpoints documentation will be available browsing to `localhost:{port}/documentation`.


# Chosen stack: 
- **Fastify**: 
  1. High performance: Fastify is known for its speed.
  2. Data consistency: Its built-in features, such as schema validation, make it easier to enforce data consistency.
  3. Built-in JSON Schema Support: To validate request and response payloads directly at the framework level.
- **MongoDB**: 
  1. Ease of setup: By using a Mongo Cluster there is no need for local database setup. You can connect to the database after downloading the repository.
  2. Scalability: While this project is small, MongoDB is able to handle growing data and concurrent operations efficiently.
  3. Flexibility: The JSON-like structure of documents aligns with the trip data format provided by the 3rd-party API.

# General features:
**Authentication**:
  1. The `verifyJwt` middleware authenticates users securing routes that interact with the database. This allows the app to isolate users data and keep consistent control over sensitive operations. By authenticating users before granting access to routes that involve database interactions, the API ensures data privacy, security and accountability.
**Caching**: 
  1. API requests: At first, I was not thinking about caching data, since attributes like trip's cost could change. I noticed the API data does not change, thus I decided to cache data in order to prevent 429 errors and make the service faster.
  2. Supported locations in memory: To ensure efficient and fast validation of trip queries, the application preloads all supported locations into memory during the server startup. This reduces the need for repeated database queries and makes so that no unsopported location is queried against the 3rd-party API.


# Design decisions and compromises:
  1. To **create a favourite trip**, I decided to receive the 3rd-party API's id in the body, fetch the trip and write the result directly from the API source with its data. Once the data is fetched, the app saves the complete trip details in the database, associating it with the user who marked it as a favorite. This design was chosen to:
    1. **Prevent discrepancies** caused by outdated or incomplete data being sent by clients.
    2. Minimize the risk of uncorrect data by **fetching the complete details independently**.
    3. Simplify the **client integration**.
    4. **Performance optimization**: When users view their favorite trips, the data is served directly from the database, avoiding repeated calls to the 3rd-party API.
  2. Other endpoints using Mongo's ObjectIds: To provide security and independence from the 3rd-party system, while underlining the fact that the resource is an internal one.


