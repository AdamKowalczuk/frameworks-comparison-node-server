const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  /*  #swagger.tags = ['Post']
            #swagger.description = 'Endpoint to get list of posts.' */
  Post.find()
    .then((posts) => {
      if (!posts) {
        const error = new Error("Could not find posts!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Posts fetched!", posts: posts });
    })

    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  /*  #swagger.tags = ['Post']
            #swagger.description = 'Endpoint to get post.' */
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post fetched!", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  /*  #swagger.tags = ['Post']
            #swagger.description = 'Endpoint to update post.' */
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }

      post.caption = req.body.caption;
      post.imageUrl = req.body.imageUrl;
      post.imageId = req.body.imageId;
      post.location = req.body.location;
      post.tags = req.body.tags;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  /*  #swagger.tags = ['Post']
            #swagger.description = 'Endpoint to create post.' */
  const imageUrl = `${req.protocol}://${req.hostname}${process.env.PORT ? ":" + process.env.PORT : ""}/${req.file.path}`;
  const post = new Post({
    creator: req.body.userId,
    caption: req.body.caption,
    imageUrl: imageUrl,
    location: req.body.location,
    tags: req.body.tags,
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        postId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
