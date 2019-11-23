const graphql = require('graphql')

const schema = graphql.buildSchema(`
  type Query {
    hello (a: String): String
  }
`)

const root = {
  hello (root, args) {
    console.log(root, args, '.....')
    return 'hello, world'
  }
}

graphql(schema, '{ hello (a: "hhh") }', root).then((result) => {
  console.log(result)
})