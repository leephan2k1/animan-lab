module.exports = {
  existChecker: (instance, message, response) => {
    if (instance) {
      return response.status(200).json({
        success: false,
        message: message,
      });
    }
  },
  nonExistChecker: (instance, message, response) => {
    if (!instance) {
      return response.status(200).json({
        success: false,
        message: message,
      });
    }
  },
};
