const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants;

module.exports = class InternalServerErrors extends Error {
  constructor(massage) {
    super(massage);
    this.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
};
