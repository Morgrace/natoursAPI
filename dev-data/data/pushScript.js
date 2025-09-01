import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Tour from '../../models/tourModel.js';
import Review from '../../models/reviewModel.js';
import User from '../../models/userModel.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
//connecting mongoose to the DB
mongoose
  .connect(DB)
  .then(() => console.log('MongoDb connected'))
  .catch((err) => console.error(err.message));

console.log(process.argv);
//reading file
const dataToBeImported = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'),
);
const dataToBeImported2 = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8'),
);
const dataToBeImported3 = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);
//function declaration
const deleteAllData = async () => {
  try {
    const deleted = await Tour.deleteMany();
    const deleted2 = await User.deleteMany();
    const deleted3 = await Review.deleteMany();
    console.log(`${deleted} successfully deleted`);
  } catch (error) {
    console.error(error);
  }
};
const importDataFrom = async () => {
  try {
    await Tour.create(dataToBeImported);
    await User.create(dataToBeImported2, { validateBeforeSave: false });
    await Review.create(dataToBeImported3);
    console.log('Data successfully imported');
  } catch (error) {
    console.error(error);
  }
};
if (process.argv[process.argv.length - 1] === '--import')
  await importDataFrom();

if (process.argv[process.argv.length - 1] === '--delete') await deleteAllData();
//to run the script write on the command line node __filepath__ then indicate the process.argv option with --import or --delete
