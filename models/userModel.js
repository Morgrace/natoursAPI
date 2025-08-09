import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
//fat models; thin controllers
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  photo: String,

  password: {
    type: String,
    minlength: [8, 'Password must be up to 8 characters'],
    maxlength: [30, 'Password must not be more than 30 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //this only works on CREATE and SAVE!!!
      validator(value) {
        return this.password === value;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // only run this function if password was not modified
  if (!this.isModified('password')) return next();
  // has the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//instance method... going to be available on all objects of a certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    console.log(changedTimestamp, JWTTimestamp);
    // if the time the token was issued is less than the time password was changed or if the time password was chnaged is greater than time token was issued
    return JWTTimestamp < changedTimestamp;
  }

  //false means that the password has not been changed since the user registered
  return false;
};

export const User = mongoose.model('User', userSchema);
