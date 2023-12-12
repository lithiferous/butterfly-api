'use strict';

const constants = require('./constants');
const express = require('express');
const FileAsync = require('lowdb/adapters/FileAsync');
const lowdb = require('lowdb');
const v1Router = require('./v1/routes/index');
const { swaggerDocs: V1SwaggerDocs } = require('./v1/swagger');

async function createApp() {
  const app = express();
  app.use(express.json());
  app.use(v1Router);

  app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  return app;
}

/* istanbul ignore if */
if (require.main === module) {
  (async () => {
    const app = await createApp();
    const port = process.env.PORT || 8000;
    app.db = await lowdb(new FileAsync(constants.DB_PATH));

    app.listen(port, () => {
      V1SwaggerDocs(app, port);
      console.log(`Butterfly API started at http://localhost:${port}`);
    });
  })();
}

module.exports = createApp;
