const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants;

module.exports = class InternalServerErrors extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
};
