const posts = require('../frontend-engineering/meta')

module.exports = posts.map(x => {
  return [x.path, x.title]
})
