const { PORT = 3000 } = process.env;
const { DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { JWT_SECRET = 'movies-explorer-secret' } = process.env;

module.exports = { PORT, DB_URL, JWT_SECRET };
