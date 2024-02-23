const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");

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

exports.searchPosts = (req, res, next) => {
  /*  #swagger.tags = ['Post']
            #swagger.description = 'Endpoint to search posts.' */
  const searchTerm = req.query.q;

  Post.find({ $text: { $search: searchTerm } })
    .then((posts) => {
      if (!posts || posts.length === 0) {
        const error = new Error("No posts found matching the search term!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Posts found!", posts: posts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  /*  #swagger.tags = ['Post']
            #swagger.description = 'Endpoint to delete a post.' */
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }
      return post.remove();
    })
    .then(() => {
      res.status(200).json({ message: "Post deleted successfully!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.likePost = (req, res, next) => {
  /*  #swagger.tags = ['Post']
      #swagger.description = 'Endpoint to like a post.' */
  const postId = req.params.postId;
  const userId = req.userId; // Zakładając, że masz dostęp do ID użytkownika z middleware isAuth

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }

      // Sprawdź, czy użytkownik już polubił ten post
      const isLiked = post.likes.includes(userId);

      if (!isLiked) {
        // Dodaj ID użytkownika do listy polubień postu
        post.likes.push(userId);
      } else {
        const error = new Error("Post already liked by the user.");
        error.statusCode = 400;
        throw error;
      }

      return post.save();
    })
    .then((updatedPost) => {
      return User.findById(userId);
    })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }

      const isPostLiked = user.likedPosts.includes(postId);

      if (!isPostLiked) {
        user.likedPosts.push(postId);
      }
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "Post liked successfully." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.unlikePost = (req, res, next) => {
  /*  #swagger.tags = ['Post']
      #swagger.description = 'Endpoint to unlike a post.' */
  const postId = req.params.postId;
  const userId = req.userId;

  let foundPost;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }

      foundPost = post;

      const likeIndex = post.likes.indexOf(userId);
      if (likeIndex === -1) {
        const error = new Error("Post is not liked by the user.");
        error.statusCode = 400;
        throw error;
      }

      post.likes.splice(likeIndex, 1);

      return post.save();
    })
    .then(() => {
      return User.findById(userId);
    })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }

      const postIndex = user.likedPosts.indexOf(postId);
      if (postIndex !== -1) {
        user.likedPosts.splice(postIndex, 1);
      }

      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "Post unliked successfully." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
