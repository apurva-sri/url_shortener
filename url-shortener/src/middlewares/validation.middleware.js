const ApiError = require("../utils/ApiError");

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        400,
        error.details.map((item) => item.message).join(", "),
      );
    }

    req.body = value;

    next();
  };
};

module.exports = validate;
