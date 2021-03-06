const Post = require("../models/Post");

module.exports = {
  filters: async (req, res, next) => {
    const filters = req.query;
    const {
      title,
      tags,
      sort,
      sortview,
      sortlike,
      page,
      limit,
      excludetags,
      populate,
    } = filters;

    const conditions = {};
    const options = {};

    //exclude field __v
    options.select = "-__v";

    //just accept approved post:
    conditions.approve = true;

    if (populate) {
      options.populate = "author_id";
    }

    if (title) conditions.title = { $regex: title, $options: "i" };

    if (tags)
      conditions.tags = {
        $elemMatch: {
          $regex: tags,
          $options: "i",
        },
      };

    if (excludetags) {
      conditions["$nor"] = [
        {
          tags: {
            $elemMatch: {
              $regex: excludetags,
              $options: "i",
            },
          },
        },
      ];
    }

    if (page) options.page = +page;

    if (limit) options.limit = +limit;

    if (sort) options.sort = { ...options.sort, createdAt: sort };

    if (sortview) options.sort = { ...options.sort, view: sortview };

    if (sortlike) options.sort = { ...options.sort, like: sortlike };

    const posts = await Post.paginate(conditions, options);

    return res.status(200).json({ success: true, posts });
  },
};
