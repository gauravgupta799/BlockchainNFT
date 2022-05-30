const userSchema = require("../models/Users");

const getAllUserList = async () => {
  const listings = await userSchema.find({}).sort({ created: "desc" });
  return listings;
};

const getUserByEmailId = async (pEmail) => {
  const listing = await userSchema.find({ email: pEmail });
  if (!listing) {
    return "listing does not exist";
  }
  return listing;
};

const addNewUser = async (args) => {
  const listing = await new userSchema(args).save();
  return listing;
};
//Login Function
const login = async (args) => {
  const listing = await userSchema.find({
    username: args.username,
    password: args.password,
  });

  if (!listing) {
    return "Invalid Username or Password";
  }
  
  return listing;
};

module.exports = { getAllUserList, getUserByEmailId, addNewUser, login };
