[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

# Install & Run sample app

Make sure you've got the latest stable node and yarn installed.

Run from project root:

```bash
$ yarn install
$ yarn bootstrap
$ yarn build
```

Then, go to `packages/example-ts-express-react` and create `.env` file from the template:

```bash
$ cp ./.env.example ./.env
```

Then, edit it following recommendations in the comments.

After that, start the server:

(in the same `packages/example-ts-express-react` dir)
```bash
$ yarn start:server 
```

This should start the server on `http://localhost:8080`;

# Publish monorepo packages manually

Install dependencies if you didn't:

```bash
$ yarn install
$ yarn bootstrap
```

Run publish:

```bash
$ yarn publish
```

follow the wizard.
