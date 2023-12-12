'use strict';

const express = require('express');
const userController = require('../controllers/users');

const router = express.Router();

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user with a given id
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: UID of the user
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
 *                   $ref: "#/components/schemas/User"
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         username:
 *           type: string
 *           example: alex
 */

router.get('/:userId', userController.getUser);

/**
 * @openapi
 * /users/:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a user with a name
 *     requestBody:
 *      description: Create a user given his name
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: alex
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
 *                   $ref: "#/components/schemas/User"
 */

router.post('/', userController.createUser);

module.exports = router;
