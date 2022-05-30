const GraphQL = require("graphql");
const query = require("./queries");
const mutation = require("./mutations");

module.exports = new GraphQL.GraphQLSchema({
  query: query,
  mutation: mutation,
});
