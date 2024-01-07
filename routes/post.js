const express = require("express");
const { body } = require("express-validator");

const Post = require("../models/post");
const postController = require("../controllers/post");

const router = express.Router();

router.get("/api/posts", postController.getPosts);
router.get("/api/posts/:postId", postController.getPost);
router.post("/api/posts", postController.createPost);
router.put("/api/posts/:postId", postController.updatePost);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - postId
 *         - caption
 *         - file
 *         - location

 *
 *       properties:
 *         postId:
 *           type: string
 *         caption:
 *           type: string
 *         imageId:
 *           type: string
 *         imageUrl:
 *            type: url
 *         file:
 *            type: file
 *         location:
 *            type: string
 *         tags:
 *            type: string

 *       example:
 *         postId: 31243124
 *         caption: CAPTION!
 *         imageId: 12345324
 *         imageUrl: "/"
 *         file: "/"
 *         location: Warsaw
 *         tags: test
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The posts managing API
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 * /posts/{id}:
 *   get:
 *     summary: Get the post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The post response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The post was not found
 *   put:
 *    summary: Update the post by the id
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The post id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: The post was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      404:
 *        description: The post was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *
 *     responses:
 *       200:
 *         description: The post was deleted
 *       404:
 *         description: The post was not found
 */
