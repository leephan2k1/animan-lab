const Joi = require("joi");

const validateParams = (schema, name) => {
  return (req, res, next) => {
    if (["signin", "signup", "secret"].indexOf(req.params[name]) !== -1) {
      return next();
    }

    const validateResult = schema.validate({
      param: req.params[name],
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
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

module.exports = {
  validateParams,
  validateBody,
  schemas,
};
