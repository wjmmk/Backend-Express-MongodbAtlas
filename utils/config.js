require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET

const MONGO_DB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.MONGO_DB_URI_TEST
  : process.env.MONGO_DB_URI

module.exports = {
  MONGO_DB_URI,
  PORT,
  SECRET
}