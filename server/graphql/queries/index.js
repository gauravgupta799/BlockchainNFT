const { GraphQLObjectType } = require("graphql");
const user = require("./userQuery");

const RootQuery = new GraphQLObjectType({
  name: "Queries",
  description: "Query List",
  fields: () => ({
    ...user,
  }),
});

module.exports = RootQuery;
