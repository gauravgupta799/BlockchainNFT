const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    // required: 'Please enter a name',
  },
  username: {
    type: String,
    trim: true,
    // required: 'Please enter a name',
  },
  password: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    // required: 'You must supply an email!',
  },
  password: {
    type: String,
    trim: true,
    // required: 'You must supply an email!',
  },
  isAgent: {
    type: Boolean,
    default: false,
  },
  isCreator: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  blockChainAddress: [
    {
      userType: {
        type: String,
      },
      address: {
        type: String,
      },
    },
  ],
});

// define our indexes
usersSchema.index({
  name: "text",
});

module.exports = mongoose.model("users", usersSchema);
