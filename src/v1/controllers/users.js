'use strict';

const shortid = require('shortid');
const { validateUser } = require('./validators');

/**
 * Get an existing user
 */
const getUser = async (req, res) => {
  const user = await req.app.db.get('users')
    .find({ id: req.params.userId })
    .value();

  if (!user) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(user);
};

/**
 * Create a new user
 */
const createUser = async (req, res) => {
  try {
    validateUser(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const newUser = {
    id: shortid.generate(),
    ...req.body
  };

  await req.app.db.get('users')
    .push(newUser)
    .write();

  res.json(newUser);
};

module.exports = {
  createUser,
  getUser
};
