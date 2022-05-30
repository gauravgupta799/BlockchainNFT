const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} = require("graphql");
const {
  addNewUser,
} = require("../../controllers/userController");
const { UsersType } = require("../types/rootTypes");

const addUser = {
  type: UsersType,
  description: "add a new listing",
  args: {
    username: { type: GraphQLString},
    name: { type: GraphQLString},
    email: { type: GraphQLString},
    password: { type: GraphQLString},
    isAgent: { type: GraphQLBoolean },
    isCreator: { type: GraphQLBoolean },
    isAdmin: { type: GraphQLBoolean},
  },
  resolve(parentValue, args) {
    return addNewUser(args);
  },
};

module.exports = { addUser };
