import mongoose from 'mongoose';

require('dotenv').config();

let dbName = '';
switch (process.env.NODE_ENV) {
  case 'production':
    dbName = process.env.DB_NAME;
    break;
  case 'development':
    dbName = process.env.DEV_DB_NAME;
    break;
  case 'test':
    dbName = process.env.TEST_DB_NAME;
    break;
  default:
    throw new Error("NODE_ENV doesn't exist.");
}
const dbUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${dbName}`;

const connectdb = async () => {
  try {
    const dbconn = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('connected to mongodb.');

    return dbconn;
  } catch (err) {
    console.log(`failed to connect to mongodb. message:${err}`);
    throw err;
  }
};

export default connectdb;
