const { validationResult } = require("express-validator");

const User = require("../models/user");

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
      user.email = req.body.email;
      user.password = req.body.password;
      user.username = req.body.username;
      user.imageUrl = req.body.imageUrl;

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
