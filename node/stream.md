# Stream

1. 服务器中的 HTTP Request
1. 客户端中的 HTTP Response
1. 标准输出 stdout

## 属性

+ destroy
+ finish
+ error

## stream / length

+ `WritableState`
+ `Symbol(KHandler)`
+ `res.write`
  + `write_`
    + `res.socket.cork`
    + `res._send`
      + `res._writeRaw`
        + `stream.write`
          + `writeOrBuffer`
+ `res.end`
  + `res._send`
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
  + `res._finish`
