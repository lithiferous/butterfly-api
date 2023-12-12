'use strict';

const express = require('express');
const butterflyController = require('../controllers/butterflies');

const router = express.Router();

/**
 * @openapi
 * /butterflies/{butterflyId}:
 *   get:
 *     tags:
 *       - Butterflies
 *     summary: Get a butterfly with a given id
 *     parameters:
 *       - in: path
 *         name: butterflyId
 *         schema:
 *           type: string
 *         required: true
 *         description: UID of the butterfly
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
 *                   $ref: "#/components/schemas/Butterfly"
 * components:
 *   schemas:
 *     Butterfly:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         commonName:
 *           type: string
 *           example: test-butterfly
 *         species:
 *           type: string
 *           example: Testium Butterflius
 *         article:
 *           type: string
 *           example: https://example.com/testium_butterflius
 */

router.get('/:butterflyId', butterflyController.getButterfly);

/**
 * @openapi
 * /butterflies/:
 *   post:
 *     tags:
 *       - Butterflies
 *     summary: Register a butterfly
 *     requestBody:
 *      description: Create butterfly entity given article, species and common name
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              commonName:
 *                type: string
 *                example: test-butterfly
 *              species:
 *                type: string
 *                example: Testium Butterflius
 *              article:
 *                type: string
 *                example: https://example.com/testium_butterflius
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
 *                   $ref: "#/components/schemas/Butterfly"
 */

router.post('/', butterflyController.createButterfly);

module.exports = router;
