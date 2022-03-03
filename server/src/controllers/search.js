const Post = require("../models/Post");

module.exports = {
  filters: async (req, res, next) => {
    const filters = req.query;
    const { title, tags, sort } = filters;
    let posts;

    //title filter
    if (title) {
      posts = await Post.find(
        {
          title: { $regex: title, $options: "i" },
        },
        { __v: 0 }
      );
    }

    //sort filter
    if (sort) {
      if (!posts) {
        posts = await Post.find({}, { _v: 0 });
      }
      switch (sort) {
        case "asc":
          posts = posts.sort(
            (a, b) =>
              new Date(a.createdAt.toString()) -
              new Date(b.createdAt.toString())
          );
          break;
        case "desc":
          posts = posts.sort(
            (a, b) =>
              new Date(b.createdAt.toString()) -
              new Date(a.createdAt.toString())
          );
          break;
      }
    }

    //tags filter
    if (tags) {
      posts = await Post.find(
        {
          tags: { $in: [tags] },
        },
        { __v: 0 }
      );
    }

    return res.status(200).json({ success: true, posts });
  },
};
