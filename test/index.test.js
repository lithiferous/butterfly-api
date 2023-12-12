'use strict';

const lowdb = require('lowdb');
const path = require('path');
const request = require('supertest');
const shortid = require('shortid');
const FileAsync = require('lowdb/adapters/FileAsync');

const createApp = require('../src/index');

let app;
const testDbPath = path.join(__dirname, 'test.db.json');

beforeAll(async () => {
  // Create an app instance
  app = await createApp();
  app.db = await lowdb(new FileAsync(testDbPath));

  // Fill the test database with data
  await app.db.setState({
    butterflies: [
      {
        id: 'wxyz9876',
        commonName: 'test-butterfly',
        species: 'Testium butterflius',
        article: 'https://example.com/testium_butterflius'
      },
      {
        id: 'jhk234',
        commonName: 'test-butterfly-blue',
        species: 'Testium butterflius blus',
        article: 'https://example.com/testium_butterflius_blus'
      },
      {
        id: 'poiu567',
        commonName: 'test-butterfly-red',
        species: 'Testium butterflius redus',
        article: 'https://example.com/testium_butterflius_redus'
      }
    ],
    users: [
      {
        id: 'abcd1234',
        username: 'test-user'
      }
    ],
    scores: [
      {
        id: 'zxcv123',
        userId: 'abcd1234',
        butterflyId: 'wxyz9876',
        score: 3
      },
      {
        id: 'olsq1289',
        userId: 'abcd1234',
        butterflyId: 'poiu567',
        score: 5
      },
      {
        id: 'ojd1224',
        userId: 'abcd1234',
        butterflyId: 'zxcv123',
        score: 4
      }
    ]
  }).write();
});

describe('GET root', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Server is running!'
    });
  });
});

describe('GET butterfly', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/butterflies/wxyz9876');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'wxyz9876',
      commonName: 'test-butterfly',
      species: 'Testium butterflius',
      article: 'https://example.com/testium_butterflius'
    });
  });

  it('error - not found', async () => {
    const response = await request(app)
      .get('/butterflies/bad-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not found'
    });
  });
});

describe('POST butterfly', () => {
  it('success', async () => {
    shortid.generate = jest.fn().mockReturnValue('new-butterfly-id');

    const postResponse = await request(app)
      .post('/butterflies')
      .send({
        commonName: 'Boop',
        species: 'Boopi beepi',
        article: 'https://example.com/boopi_beepi'
      });

    expect(postResponse.status).toBe(200);
    expect(postResponse.body).toEqual({
      id: 'new-butterfly-id',
      commonName: 'Boop',
      species: 'Boopi beepi',
      article: 'https://example.com/boopi_beepi'
    });

    const getResponse = await request(app)
      .get('/butterflies/new-butterfly-id');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      id: 'new-butterfly-id',
      commonName: 'Boop',
      species: 'Boopi beepi',
      article: 'https://example.com/boopi_beepi'
    });
  });

  it('error - empty body', async () => {
    const response = await request(app)
      .post('/butterflies')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  it('error - missing all attributes', async () => {
    const response = await request(app)
      .post('/butterflies')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  it('error - missing some attributes', async () => {
    const response = await request(app)
      .post('/butterflies')
      .send({ commonName: 'boop' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });
});

describe('GET user', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/users/abcd1234');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'abcd1234',
      username: 'test-user'
    });
  });

  it('error - not found', async () => {
    const response = await request(app)
      .get('/users/bad-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not found'
    });
  });
});

describe('POST user', () => {
  it('success', async () => {
    shortid.generate = jest.fn().mockReturnValue('new-user-id');

    const postResponse = await request(app)
      .post('/users')
      .send({
        username: 'Buster'
      });

    expect(postResponse.status).toBe(200);
    expect(postResponse.body).toEqual({
      id: 'new-user-id',
      username: 'Buster'
    });

    const getResponse = await request(app)
      .get('/users/new-user-id');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      id: 'new-user-id',
      username: 'Buster'
    });
  });

  it('error - empty body', async () => {
    const response = await request(app)
      .post('/users')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  it('error - missing all attributes', async () => {
    const response = await request(app)
      .post('/users')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  describe('GET scores', () => {
    it('success descending', async () => {
      const response = await request(app)
        .get('/scores/abcd1234');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'olsq1289',
          userId: 'abcd1234',
          butterflyId: 'poiu567',
          score: 5
        },
        {
          id: 'ojd1224',
          userId: 'abcd1234',
          butterflyId: 'zxcv123',
          score: 4
        },
        {
          id: 'zxcv123',
          userId: 'abcd1234',
          butterflyId: 'wxyz9876',
          score: 3
        }
      ]);
    });

    it('success ascending', async () => {
      const response = await request(app)
        .get('/scores/abcd1234?sortOrder=asc');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'zxcv123',
          userId: 'abcd1234',
          butterflyId: 'wxyz9876',
          score: 3
        },
        {
          id: 'ojd1224',
          userId: 'abcd1234',
          butterflyId: 'zxcv123',
          score: 4
        },
        {
          id: 'olsq1289',
          userId: 'abcd1234',
          butterflyId: 'poiu567',
          score: 5
        }
      ]);
    });

    it('error - invalid sort order param', async () => {
      const response = await request(app)
        .get('/scores/abcd1234?sortOrder=abc');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid query sort order, need one of: `asc`, `desc`'
      });
    });

    it('error - not found', async () => {
      const response = await request(app)
        .get('/scores/bad-id');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Not found'
      });
    });
  });

  describe('POST score', () => {
    it('success', async () => {
      shortid.generate = jest.fn().mockReturnValue('new-butterfly-id');
      shortid.generate = jest.fn().mockReturnValue('new-user-id');
      shortid.generate = jest.fn().mockReturnValue('new-score-id');

      const postResponse = await request(app)
        .post('/scores/new-user-id')
        .send({
          butterflyId: 'new-butterfly-id',
          score: 4
        });

      const validOutput = {
        id: 'new-score-id',
        butterflyId: 'new-butterfly-id',
        score: 4,
        userId: 'new-user-id'
      };

      expect(postResponse.status).toBe(200);
      expect(postResponse.body).toEqual(validOutput);

      const getResponse = await request(app)
        .get('/scores/new-user-id');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual([validOutput]);
    });

    it('error - empty body', async () => {
      const response = await request(app)
        .post('/scores/new-user-id')
        .send();

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid request body'
      });
    });

    it('error - missing all attributes', async () => {
      const response = await request(app)
        .post('/scores/new-user-id')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid request body'
      });
    });
  });

});
