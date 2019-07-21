# Stream

1. 服务器中的 HTTP Request
1. 客户端中的 HTTP Response
1. 标准输出 stdout

## 属性

+ destroy
+ finish
+ error

## stream / length

+ `WritableState`/
  + `needDrain`
  + `buffered`
+ `Symbol(KHandler)`
+ `res._removeTE`/`res.chunkedEncoding`
+ `res._headerSent`
+ `req.handle.writev(req, chunks, allBuffers);`
+ `res.write`
  + `write_`
    + `res.socket.cork`
    + `res._send`
      + `res._writeRaw`
        + `stream.write`
          + `writeOrBuffer`
+ `res.end`
  + `write_`
    + `res.socket.cork`
    + `res._implicitHeader`
      + `res.writeHead`
        + `res._storeHeader`
    + `res._send` (如果是 chunk)
      + `res._writeRaw`
        + `stream.write`
          + `writeOrBuffer`
            + `socket._write`
              + `socket._writeGeneric`
                + `socket._unrefTimer`
                + `writeGeneric`
                  + `createWriteWrap`
                  + `handleWriteReq`
                  + `afterWriteDispatched`
  + `res._send`
  + `res._finish`
  + `clearBuffer`
    + `doWrite`
      + `socket._writev`
        + `socket._writeGeneric`
          + `writevGeneric`
            + `tcp.writev`
