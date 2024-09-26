# Easy Bread Playground App

### Prepare the environment:
Create a `.env` file in the root of the monorepo.

```bash
cp .env.example .env
```
Then, fill in the missing values.

### Start the docker compose services:

```bash
docker compose up -d
```

### Run in dev mode:

```bash
pnpm nx dev playground-app
```
This will start the NextJS dev server with hot reloading.
The app will be available at http://localhost:3000


### Run in production mode:

```bash
pnpm nx start playground-app
```

This will build the production version and start tne server.
The app will be available at http://localhost:3000
