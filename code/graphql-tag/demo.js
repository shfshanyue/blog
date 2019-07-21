const gql = require('graphql-tag')

const query = gql`
  {
    poem (id: 10) {
      id 
      title
    }
  }
`

console.log(query)
