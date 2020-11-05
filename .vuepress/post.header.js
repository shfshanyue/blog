const _ = require('lodash')
const path = require('path')
const fs = require('fs')

const posts = require('../post/meta')
const tags = _.uniq(posts.map(x => x.tags[0]))
const postsByTag = _.groupBy(posts, x => x.tags[0])

module.exports = tags.map(tag => {
  const posts = postsByTag[tag]
  return {
    title: tag,
    children: posts.filter(x => x.path).map(x => {
      const isExist = fs.existsSync(path.join(__dirname, '../post', x.path))
      if (isExist) {
        console.log(x.path)
      }
      return [x.path + (isExist ? '/' : ''), x.title]
    })
  }
})

