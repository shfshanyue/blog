const posts = require('../frontend-engineering/meta')
const nodePosts = require('../node/meta')
const tourPosts = require('../tour/meta')
const chinaPosts = require('../note/china/meta')
const noVpsPosts = require('../no-vps/meta')

// {
//   sideTitle,
//   path,
//   category
// } -> 
// [{ title: category, collapsable: false, children: [] }]
function getHeader (posts) {
  const getPostPair = x => [x.path, x.sideTitle || x.title]

  if (posts[0].category) {
    let category = []
    for (const post of posts) {
      if (post.category) {
        category = [...category, { title: post.category, collapsable: false, children: [ getPostPair(post) ] }] 
      } else {
        category[category.length - 1].children.push(getPostPair(post))
      }
    }
    return category
  }
  return posts.map(getPostPair)
}

module.exports = {
  fe: getHeader(posts),
  node: getHeader(nodePosts),
  tour: getHeader(tourPosts),
  china: getHeader(chinaPosts),
  noVps: getHeader(noVpsPosts)
}
