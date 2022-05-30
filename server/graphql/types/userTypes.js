const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
} = require("graphql");

const UsersType = new GraphQLObjectType({
  name: "users",
  description: "This represent an users",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    isAgent: { type: GraphQLBoolean },
    isCreator: { type: GraphQLBoolean },
    isAdmin: { type: GraphQLBoolean },
    created: { type: GraphQLString },
  }),
});

module.exports = UsersType;
