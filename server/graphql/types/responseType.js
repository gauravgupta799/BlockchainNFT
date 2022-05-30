const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
} = require("graphql");
const { UsersType } = require("./rootTypes");

const RESPONSE_TYPE = new GraphQLObjectType({
  name: "response",
  description: "This will return response",
  fields: () => ({
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    data: { type: new GraphQLObjectType(UsersType) },
  }),
});

module.exports = { RESPONSE_TYPE };
