const { GraphQLList, GraphQLString } = require("graphql");
const user = require("../../controllers");

const { UsersType } = require("../types/rootTypes");

const users = {
  type: new GraphQLList(UsersType),
  description: "List of all Users",
  resolve() {
    return user.getAllUserList();
  },
};

const userLogin = {
  type: new GraphQLList(UsersType),
  description: "Get user by user and password",
  args: {
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve:async (puser, args) => {
    return await user.login(args);
  },
};

module.exports = { users, userLogin };
