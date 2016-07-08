# Places Recommendation Service

The places recommendation service uses a item based collaborative filtering algorithm. The recommendation engine will compare all places pinned by a user against all places in the system and return the top 10 places that are similar to that user's places. 

The recommendation engine has two workers, one that will run hourly to get place types for each newly pinned place, and another that will run once a day to generate place recommendations for each user.

The worker that gets place types will query from the main postgres database to get the Google Place ID (gPlaceId). Using the gPlaceId it will make an API call to Places API to get place details and types. After getting all places, it will save the last place ID into redis.

The worker that generates recommendations will query from the main postgres database to get all users and user's places. After the recommendation engine has generated recommendations, it will save all users and their recommended places to redis.

## Table of Contents
1. [Getting started](#getting-started)
2. [Tech](#tech)
3. [Team](#team)
4. [Contributing](#contributing)

## Getting started

Clone and install dependencies:
```sh
$ npm install
```
Create `env/development.env` and set environment variables. Follow `env/.env.sample`.

### To run locally:

Prerequisites
- Install and run redis-server
```sh
$ npm install redis-server
$ redis-server
```

Start server
```sh
$ npm start
```

### To run on docker:

Prerequisites
- Create a docker machine
```sh
$ docker-compose up
```

## Redis schema
Key       / Value
Place_ID  / number (last placeId)
User ID   / Recommendations
(number)    (array of places)

## Tech
> node / express server
> node-cron for workers
> redis for database

## Directory Layout
> Use the diagram below as an example and starting point
```
├── /.github/                         # Github configs
│   ├── PULL_REQUEST_TEMPLATE         # Pull request template
├── /config/                          # Configs
│   ├── middleware.js                 # Middleware config
├── /controllers/                     # Controllers
│   ├── PlaceDetailsController.js     # Place details controller
│   ├── RecommendationsController.js  # Recommendations controller
│   ├── UserPlacesController.js       # User places controller
├── /db/                              # Database configs
│   ├── db.js                         # Postgres config
│   ├── redis.js                      # Redis config
├── /engine/                          # Recommendation files
│   ├── recommendation.js             # Recommendation engine
├── /env/                             # Environment variables
│   ├── .env.sample                   # Sample env file
├── /node_modules/                    # 3rd-party libraries and utilities
├── /routes/                          # Routes
│   ├── /api-routes.js                # API routes
├── /server/                          # Server
│   ├── server.js                     # Http server
├── /test/                            # Tests
│   ├── /places-api-test.js           # Places API test
├── /utils/                           # Utilities
│   ├── /api.js                       # Axios request functions
│   ├── /helpers.js                   # Helper functions
├── /workers/                         # Workers
│     ├── GetPlaceDetails.js          # Get place details worker
│     ├── GetUserPlaces.js            # Get user places worker
├── .eslintrc                         # ESLint settings
├── .gitignore                        # Git ignore
├── .docker-compose.yml               # Docker compose
├── DockerFile                        # Docker file
├── package.json                      # List of 3rd party libraries and utilities to be installed
└── README.md                         # Read me
```

## Team
  - Microservice Developer:   [Andrew Phavichitr](https://github.com/aphavichitr)
  - Product Owner:            [Adam Lessen](https://github.com/lessenadam)
  - Scrum Master:             [Sepehr Vakili](https://github.com/sepehrvakili)
  - Development Team Members: [Jordan Tepper](https://github.com/HeroProtagonist), [Sepehr Vakili](https://github.com/sepehrvakili), [Andrew Phavichitr](https://github.com/aphavichitr), [Adam Lessen](https://github.com/lessenadam)

## Contributing
See [CONTRIBUTING.md](https://github.com/places-app/places-app-web/blob/master/docs/_CONTRIBUTING.md) for contribution guidelines.
