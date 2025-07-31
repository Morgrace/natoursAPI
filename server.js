import app from './app.js';
import mongoose from 'mongoose';

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
//connecting mongoose to the DB
mongoose
  .connect(DB)
  .then(() => console.log('MongoDb connected'))
  .catch((err) => console.error(err.message));

//sever start
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
