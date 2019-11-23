const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql')

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world'
        }
      }
    }
  })
})

const query = '{ hello }'

graphql(schema, query).then(result => {
  // {
  //   data: { hello: "world" }
  // }
  console.log(result)
})
