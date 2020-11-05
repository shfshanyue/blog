const posts = require('../frontend-engineering/meta')
const nodePosts = require('../node/meta')

function getHeader (posts) {
  return posts.map(x => {
    return [x.path, x.title]
  })
}

module.exports = {
  fe: getHeader(posts),
  node: getHeader(nodePosts)
}
