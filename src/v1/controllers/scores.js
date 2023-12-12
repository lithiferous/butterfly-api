'use strict';

const shortid = require('shortid');
const { validateScore, validateSortOrder } = require('./validators');

/**
 * Create a new butterfly score
 */
const createScore = async (req, res) => {
  try {
    validateScore(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const newScore = {
    id: shortid.generate(),
    userId: req.params.userId,
    ...req.body
  };

  await req.app.db.get('scores')
    .push(newScore)
    .write();

  res.json(newScore);
};

/**
 * Get existing butterfly scores for user
 */
const getScores = async (req, res) => {
  if (req.query.sortOrder) {
    try {
      validateSortOrder({ sortOrder: req.query.sortOrder });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid query sort order, need one of: `asc`, `desc`' });
    }
  } else {
    req.query.sortOrder = 'desc';
  }
  const scores = await req.app.db.get('scores')
    .filter({ userId: req.params.userId })
    .orderBy(['score'], [req.query.sortOrder])
    .value();

  if (scores.length === 0) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(scores);
};

module.exports = {
  createScore,
  getScores
};
