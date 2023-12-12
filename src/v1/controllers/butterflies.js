'use strict';

const shortid = require('shortid');
const { validateButterfly } = require('./validators');

/**
 * Get existing butterfly
 */
const getButterfly = async (req, res) => {
  const butterfly = await req.app.db.get('butterflies')
    .find({ id: req.params.butterflyId })
    .value();

  if (!butterfly) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(butterfly);
};

/**
 * Create a new butterfly
 */
const createButterfly = async (req, res) => {
  try {
    validateButterfly(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const newButterfly = {
    id: shortid.generate(),
    ...req.body
  };

  await req.app.db.get('butterflies')
    .push(newButterfly)
    .write();

  res.json(newButterfly);
};

module.exports = {
  getButterfly,
  createButterfly
};

