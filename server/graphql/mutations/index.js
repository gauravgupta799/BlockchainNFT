
const {GraphQLObjectType} = require("graphql");
const userMutation = require("./userMutations");

const RootMutation = new GraphQLObjectType({
  name: "Mutations",
  description: "Mutation List",
  fields: () => ({
    ...userMutation,
  }),
});

module.exports = RootMutation;