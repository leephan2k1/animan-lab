const Joi = require("joi");

const validateParams = (schema, name) => {
  return (req, res, next) => {
    if (["sign-in", "sign-up"].indexOf(req.params[name]) !== -1) {
      return next();
    }

    const validateResult = schema.validate({
      [name]: req.params[name],
    });

    if (validateResult.error) {
      return res.status(400).json(validateResult.error);
    }

    if (!req.verified) req.verified = {};
    if (!req.verified.params) req.verified.params = {};
    req.verified.params[name] = req.params[name];

    next();
  };
};

const validateBody = (schema) => {
  return (req, res, next) => {
    const validateResult = schema.validate(req.body);

    if (validateResult.error) {
      validateResult.error.success = false;
      return res.status(400).json(validateResult.error);
    }

    if (!req.verified) {
      req.verified = {};
    }
    req.verified.body = validateResult.value;
    next();
  };
};

const schemas = {
  loginSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  signUpSchema: Joi.object().keys({
    first_name: Joi.string().required().min(1).max(25),
    last_name: Joi.string().required().min(1).max(25),
    user_name: Joi.string().required().min(2).max(10),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  userNameSchema: Joi.object().keys({
    user_name: Joi.string().min(1),
  }),
  postSchema: Joi.object().keys({
    title: Joi.string().required().min(3).max(100),
    content: Joi.string().required().min(10),
    plainText: Joi.string().required().min(10),
    images_url: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
  }),
  deletePostSchema: Joi.object().keys({
    slug: Joi.string().min(1).required(),
  }),
  updatePostSchema: Joi.object().keys({
    title: Joi.string().min(3).max(100),
    content: Joi.string().min(10),
    plainText: Joi.string().required().min(10),
    tags: Joi.array().items(Joi.string().min(2)),
    images_url: Joi.array().items(Joi.string()),
  }),
  commentSchema: Joi.object().keys({
    content: Joi.string().required().min(3),
    postSlug: Joi.string().required().min(3),
  }),
  objectIdSchema: Joi.object().keys({
    id: Joi.string().regex(/^[0-9A-Fa-f]{24}$/),
  }),
  objectIdRequiredSchema: Joi.object().keys({
    id: Joi.string()
      .required()
      .regex(/^[0-9A-Fa-f]{24}$/),
  }),
  updateCommentSchema: Joi.object().keys({
    content: Joi.string().required().min(3),
  }),
  reportSchema: Joi.object().keys({
    author_email: Joi.string().required().email(),
    author_name: Joi.string().required().min(2),
    post_id: Joi.string()
      .required()
      .regex(/^[0-9A-Fa-f]{24}$/),
    report_title: Joi.string().required().min(2),
    report_content: Joi.string().required().min(3),
  }),
  myLoveSchema: Joi.object().keys({
    title: Joi.string().required().min(5),
    description: Joi.string().min(5),
    image: Joi.string().min(3),
    tags: Joi.array().items(Joi.string().min(2)),
  }),
};

module.exports = {
  validateParams,
  validateBody,
  schemas,
};
