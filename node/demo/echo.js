const http = require('http')

const data = Array.from(Array(10000), x => 0).join(',')

http.createServer((req, res) => {
  res.end(data)
}).listen(3333)
