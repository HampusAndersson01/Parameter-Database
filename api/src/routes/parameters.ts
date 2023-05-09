/** source/routes/posts.ts */
import { Router } from "express";
import controller from "../controllers/parameters";
const router = Router();

/**
 * @swagger
 * /parameters:
 *   get:
 *     summary: Get all parameters
 *     description: Returns a list of all parameters with associated units, images, possible values, and rig families
 *     responses:
 *       200:
 *         description: A list of parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parameter'
 *     tags:
 *       - Parameters
 */
router.get("/", controller.getParameters);

/**
 * @swagger
 * /parameters/{id}:
 *   get:
 *     summary: Get a parameter by id
 *     description: Retrieve a single parameter by id
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the parameter to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single parameter object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parameter'
 *       404:
 *         description: Parameter not found
 *
 *     tags:
 *       - Parameters
 */
router.get("/:id", controller.getParameter);

/**
 * @swagger
 * /parameters:
 *   post:
 *     summary: Create new parameter(s)
 *     description: Create new parameter(s) using an array of objects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CreateParameter'
 *     responses:
 *       200:
 *         description: Parameter created
 *     tags:
 *       - Parameters
 */

router.post("/", controller.createParameters);

/**
 * @swagger
 * /parameters/{id}:
 *   put:
 *     summary: Update a parameter
 *     description: Update a parameter
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the parameter to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateParameter'
 *     responses:
 *       200:
 *         description: Parameter updated
 *     tags:
 *       - Parameters
 */
router.put("/:id", controller.updateParameter);

/**
 * @swagger
 * /parameters/{id}:
 *   delete:
 *     summary: Delete a parameter
 *     description: Delete a parameter
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the parameter to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Parameter deleted
 *     tags:
 *       - Parameters
 */
router.delete("/:id", controller.deleteParameter);

export default router;
