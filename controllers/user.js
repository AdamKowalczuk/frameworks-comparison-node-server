const { validationResult } = require("express-validator");

const User = require("../models/user");
const Post = require("../models/post");

exports.getUsers = (req, res, next) => {
  /*  #swagger.tags = ['User']
            #swagger.description = 'Endpoint to get list of users.' */
  User.find()
    .then((users) => {
      if (!users) {
        const error = new Error("Could not find users!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Users fetched!", users: users });
    })

    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUser = (req, res, next) => {
  /*  #swagger.tags = ['User']
            #swagger.description = 'Endpoint to get user.' */
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "User fetched!", user: user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUser = (req, res, next) => {
  /*  #swagger.tags = ['User']
            #swagger.description = 'Endpoint to update user.' */
  const userId = req.params.userId;
  const imageUrl = req.file ? `${req.protocol}://${req.hostname}${process.env.PORT ? ":" + process.env.PORT : ""}/${req.file.path}` : undefined;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 404;
        throw error;
      }
      user.name = req.body.name;
      user.username = req.body.username;
      user.bio = req.body.bio;
      if (imageUrl) {
        user.imageUrl = imageUrl;
      }

      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "User updated!", user: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUserPosts = (req, res, next) => {
  /*  #swagger.tags = ['User']
      #swagger.description = 'Endpoint to get posts of a specific user.' */
  const userId = req.params.userId;

  Post.find({ creator: userId })
    .then((posts) => {
      if (!posts || posts.length === 0) {
        const error = new Error("No posts found for this user!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "User posts fetched successfully!", posts: posts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
