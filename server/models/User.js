const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
  },
  password: {
      type: String,
      required: true,
      minlength: 4
  },
  username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  // firstName: {
  //     type: String,
  //     required: true,
  //     minlength: 1
  // },
  // lastName: {
  //     type: String,
  //     required: true,
  //     minlength: 1
  // },
  posts: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Post'
      }
  ],
  recipes: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Recipe'
      }
  ]
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
