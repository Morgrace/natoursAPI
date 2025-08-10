//this catches runtime errors that are not caught;
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! shutting down!🤯');
  console.log(err.name, err.message);
  process.exit(1);
});

import app from './app.js';
import mongoose from 'mongoose';

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
//connecting mongoose to the DB
mongoose
  .connect(DB)
  .then(() => console.log('MongoDb connected 🌐'))
  .catch((err) => console.error(err.message));

//sever start
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//this handles unhandledPromiseRejection globally;
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! shutting down... 🤯');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
