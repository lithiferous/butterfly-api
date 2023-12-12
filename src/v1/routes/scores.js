'use strict';

const express = require('express');
const scoreController = require('../controllers/scores');

const router = express.Router();

/**
 * @openapi
 * /scores/{userId}:
 *   post:
 *     tags:
 *       - Scores
 *     summary: Create a score for a particular butterfly given by a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: UID of the user that wants to submit score
 *     requestBody:
 *       description: Submit batterfly score (0-5) for a particular user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               butterflyId:
 *                 type: string
 *                 example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *               score:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   $ref: "#/components/schemas/Score"
 * components:
 *   schemas:
 *     Score:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         userId:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         butterflyId:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         score:
 *           type: integer
 *           minimum: 0
 *           maximum: 5
 */

router.post('/:userId', scoreController.createScore);

/**
 * @openapi
 * /scores/{userId}:
 *   get:
 *     tags:
 *       - Scores
 *     summary: Get a list of butterfly scores for a particular user
 *     parameters:
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         description: The order of sorting (asc, desc). Desc by default
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: UID of the user that wants to submit score
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     $ref: "#/components/schemas/Score"
 */

router.get('/:userId', scoreController.getScores);

module.exports = router;
