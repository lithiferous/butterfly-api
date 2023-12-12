# 🦋 Butterfly critique

Butterfly critique is an API designed for butterfly enthusiasts. So far, it's an [`express`](https://expressjs.com/)-based API that stores butterflies and users.

Data persistence is through a JSON-powered database called [`lowdb`](https://github.com/typicode/lowdb).

Validation is built using an assertion library called [`@mapbox/fusspot`](https://github.com/mapbox/fusspot).

## Significant Changes

### Versioning

The current agile environment forces developers to design software with regard to unexpected API changes, versioning is one of the ways to enable an easier transition/deprecation of logic that serves the product. In order, to address this issue I have decided to create sufficient infrastructure for easier integration of updated API versions later on on different handlers. However, as of right now, all endpoints do not require `api/v1` prefix since API is not mature enough yet, but the incorporated feature allows testing released features much quicker using the new project structure.

### Project Structure

```
└── src
    ├── constants.js
    ├── index.js
    └── v1
        ├── controllers
        │   ├── butterflies.js
        │   ├── scores.js
        │   ├── users.js
        │   └── validators.js
        ├── routes
        │   ├── butterflies.js
        │   ├── index.js
        │   ├── scores.js
        │   └── users.js
        └── swagger.js
```

Working with Butterfly API I have decided to decouple the endpoints from the main `index.js` file into a separate folder with the use of a `Router` in the express framework. Once the codebase gets big enough - the project will become tedious and cumbersome to work with due to the many abstractions that the developer has to take in mind while working on a given problem. In order to keep the project maintainable we have to foresee such changes and suggest a better code organization by separating modules by functionality. In this API I have done minimal separation, but one that I believe does a developer a favor by decoupling the functions that handle interactions with the database (`controllers`) and higher-order request path `routes` that describe the API. It would be meaningful to decouple the `controllers` even further and keep only error handling in them while calling functions from a `database` module, however, I decided to keep the changes minimal and showcase mainly the direction to provide enough information for evaluation.

Hence, the structure is the following: `src` folder has the highest level of abstraction and offers a main `index.js` file that creates an express application and initializes required services (logger, database); The next level would be a versioned application under `v1`, it offers `routes` to handle incoming requests to the application, and the latter one calls `controllers` to interact with the database, validate body requests and perform main calculations. From my perspective such separation gives a much more granular level of control as I can focus on different levels of functional middleware in a scoped, and more readable way, which in the long term helps developers stay productive and gives them a cleaner standard to use.

### Database Handler

Due to the fact that modules have been decoupled from the core application, in order to pass an initialized database client to other modules, I have decided to use a context variable that would persist the state across calls in different modules as follows:

```node.js
const app = await createApp();
app.db = await lowdb(new FileAsync(constants.DB_PATH));
```

This allows me to access the controller inside modules from the request:

```node.js
const getScores = async (req, res) => {
	const scores = await req.app.db.get('scores').value();
}
```

### Swagger

I have decided to also enable Swagger in order to have a clearer view of existing endpoints and configurations. I believe that good documentation can save a significant amount of resources by providing developers with tools to analyze and interact with the problem autonomously. Therefore, having an outlay that presents a higher-level view as well as one that gives a live testing capacity can make a difference due to the fact that it offers a convenient way to gain insight into existing API and facilitates the engagement with your project for newcomers.

## Additional features:

As requested by the assignment, I added a handler to support rating butterflies for different users, as well as to retrieve their previous scores. Both handlers rely on information input from a specific user who submits a rating, therefore, to keep it simple I decided to decouple the scoring mechanic into a separate feature to keep the core API clean. To address it I implemented a separate `scores` handler on the main API that routes the following requests:

### User can score butterflies

The request handler uses a path parameter called `userId` to submit a new rating:

```node.js
router.post('/scores/:userId', scoreController.createScore);
```

Rating only exists when the user has decided to evaluate a butterfly, so it is logical to associate each score request with a unique user identifier.

To provide additional details I used JSON request:

```
{
  "butterflyId": "q7C2ZN2f2",
  "score": 5
}
```

Fairly straightforward, we specify which butterfly should be rated with `butterflyId` and submit the `score` that the user has given.

### Retrieve user-rated butterflies sorted by score

Using similar logic, the request handler uses `userId` on the path to obtain all scores that he previously submitted:

```node.js
router.get('/:userId', scoreController.getScores);
```

However, this handle is extended with a query to specify the sorting order for scores (`/scores/<userId>?sortOrder=asc`), without the query the default variant is always `desc`, however, it is useful to treat it as a parameter to query the database later on.

## Future Concerns:

### Environment

Even though, I haven't implemented `env` variables, it would make sense to use those instead of constants inside an isolated environment like Docker. Another concern is to create a deployment mode mechanic that would differentiate between the local testing environment and production to resolve database and other service-related initializations.

### Models

It would be nice to see models moved to a separate module and typed with TS to have compile time errors. The current definition of `controllers` is not reliable, therefore, it is reasonable to revisit it, once the project gets traction.

### Database

Implementation of the database is not decoupled from the `lowdb` module, therefore, the methods called inside `controllers` would become obsolete once refactoring for a real database is required. The regular approach of having a `Base` database model that is overloaded with either `LocalFsDB` or `MongoDB` adapters should suffice, but the implementation requires further investigation into project resources.

## Task

Butterfly critique is already a pretty great API, but we think it would be even better if it let users critique butterflies. Your task is to create new API endpoints that:

1. Allow a user to rate butterflies on a scale of 0 through 5
1. Allow retrieval of a list of a user's rated butterflies, sorted by rating

You should also provide a small **write-up** that explains the decisions (for instance, the HTTP verbs for new endpoints) and trade-offs you made. If you add any new dependencies, spend some time talking about why you chose them.

You are free to refactor or improve any code you think should be refactored, but please include a note about such changes in your write-up. Any changes you make should be scoped and explained as though you are opening a pull request against an existing codebase used in a production API service.

If you have any questions or concerns, please do not hesitate to contact us!

### What we're looking for

- Your code should be extensible and reusable
- Your code should be well tested
- Your code should be tidy and adhere to conventions
- Your changes should be well-scoped and explained in the write-up
- Your write-up should be thoughtful and coherent

❗️ Note: please do not write your name anywhere in your solution, since this prevents us from evaluating it anonymously.

### Scoring rubric

You will be scored on the following aspects of your work:

- Endpoint implementation
- Endpoint design
- Appropriate testing of new code
- Tidiness and adherence to conventions
- Appropriate refactoring
- Communication in the write-up

0 = poor 1 = adequate 2 = exceptional

The maximum possible score is 12.

## Developing

### Requirements

- Node v14.x
- npm v6

### Setup

Install dependencies with:

```sh
npm install
```

If you need to recreate the butterflies database, you can run:

```sh
npm run init-db
```

### Running

To run the application locally:

```sh
npm start
```

You should see a message that the application has started:

```sh
Butterfly API started at http://localhost:8000
```

You can manually try out the application using `curl`:

```sh
# GET a butterfly
curl http://localhost:8000/butterflies/xRKSdjkBt4

# POST a new butterfly
curl -X POST -d '{"commonName":"Brimstone", "species":"Gonepteryx rhamni", "article":"https://en.wikipedia.org/wiki/Gonepteryx_rhamni"}' -H 'content-type: application/json' http://localhost:8000/butterflies

# GET a user
curl http://localhost:8000/users/OOWzUaHLsK
```

**For developing**, you can run the application with auto-restarts on code changes using:

```sh
npm run watch
```

### Testing

This project uses [`jest`](https://jestjs.io/) as its testing framework.
If you are unfamiliar with `jest`, check out its [documentation](https://jestjs.io/docs/en/getting-started).

This project has `eslint` and a custom config [`@mapbox/eslint-config-mapbox`](https://www.npmjs.com/package/@mapbox/eslint-config-mapbox) setup for code linting.

To run the linter and all tests:

```sh
npm test
```

**For developing**, you can run `jest` with auto-restarts using:

```sh
npm run test-watch
```
