const Readable = require('stream').Readable

const src = new Readable()
src.push('hello')
src.push('world')
src.push(null)

src.pipe(process.stdout)
