# Bandcal

The simplest band calendar app for managing rehearsal times for bands and people
that share a rehearsal space.

## Features

Has an easy text-only calendar, no fiddly time pickers or anything.

Has a minimalistic message board for band members to communicate.

Editable by all users that have access, no user accounts, works based on trust.

This is a re-write of an app I made ~20 years ago in zope and has been successfully used by dozens of bands since then. I now use [Vue.js](https://vuejs.org/) for the frontend and a simple [TypeScript](https://www.typescriptlang.org/) [Express](https://expressjs.com/) server with [SQLite](https://www.sqlite.org/) for the backend.

[Nginx](https://nginx.org/) is used as proxy for both api and app. The app in production mode is served as static files with its own nginx server.

Mostly (re-)written by AI, directed and reviewed by me.

## Requirements

- [Taskfile](https://taskfile.dev/#/installation) for managing development tasks
- [Docker](https://www.docker.com/)
- [htpasswd](https://httpd.apache.org/docs/2.4/programs/htpasswd.html)

## Installation

### Setup

First, set up the project by installing dependencies for both the app and the API:
```bash
task setup
```

### Setup a basic auth user

```bash
task setup-auth
```

## Configuration

The configuration for the API can be found in the `api/config/config.json` file. Here is an example configuration:

```javascript
{
  "database": {
    "file": "../db/database.sqlite"  // default
  }
}
```

- `database.file`: Path to the SQLite database file.

## Development

To start the development environment, run:
```bash
task start:dev
```

This will start the API and the app in development mode.

### Start in production mode

To start the app in production mode, run:
```bash
task start:prod
```

This will build the app and start it in production mode. This is useful for testing the app in a production-like environment.

### Start in production mode with in a docker environment

```bash
export BANDCAL_POSTFIX=666 BANDCAL_PORT=8080 && docker compose -p bandcal${BANDCAL_POSTFIX} up
```

`BANDCAL_POSTFIX` is used to run multiple instances of the app on the same machine.
`BANDCAL_PORT` is the port the app will be available on.

### Rebuild the app

To rebuild the app, run:
```bash
task rebuild:app
```

### Rebuild the API

To rebuild the API, run:
```bash
task rebuild:api
```

### Stop the development environment

To stop the development environment, run:
```bash
task stop
```

To remove all containers and volumes, run:
```bash
task remove
```

## Open the app

The app will be available at [http://localhost:8080](http://localhost:8080).

The API will be available at [http://localhost:8080/api](http://localhost:8080/api).
Note that in dev mode this is a vite proxy to the API running on port 3000, in prod the proxy is nginx.

API Ping: [http://localhost:8080/api/ping](http://localhost:8080/api/ping)

## TODO

- [ ] Add tests
- [ ] Easier deployment
- [ ] Clean up code
- [ ] Make some of the UI configurable (base color scheme, titles etc)
- [ ] Maybe improve authentication
- [X] Don't add more features, it works as it is

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.