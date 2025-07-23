// models/user.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Regex for alphanumeric password
const alphaNumericRegex = /^[a-zA-Z0-9]{6,}$/;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      validate: {
        validator: function (v) {
          return alphaNumericRegex.test(v);
        },
        message:
          'Password must be at least 6 characters and alphanumeric only',
      },
    },
  },
  { timestamps: true }
);

// Pre-save hook for hashing password
userSchema.pre('save', async function (next) {
  // Only hash the password if it's new or modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model('User', userSchema);
export default User;
