'use strict';

const v = require('@mapbox/fusspot');

const validateButterfly = v.assert(
  v.strictShape({
    commonName: v.required(v.string),
    species: v.required(v.string),
    article: v.required(v.string)
  })
);

const validateScore = v.assert(
  v.strictShape({
    butterflyId: v.required(v.string),
    score: v.required(v.range(0,5))
  })
);

const validateSortOrder = v.assert(
  v.strictShape({
    sortOrder: v.required(v.oneOf('asc', 'desc'))
  })
);

const validateUser = v.assert(
  v.strictShape({
    username: v.required(v.string)
  })
);

module.exports = {
  validateButterfly,
  validateScore,
  validateSortOrder,
  validateUser
};
