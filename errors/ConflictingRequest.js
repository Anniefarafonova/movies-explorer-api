// const { HTTP_STATUS_CONFLICT } = require('http2').constants;

// module.exports = class ConflictingRequest extends Error {
//   constructor(massage) {
//     super(massage);
//     this.statusCode = HTTP_STATUS_CONFLICT;
//   }
// };

class ConflictingRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictingRequest;
// 409
