console.log(`Pid: ${process.pid}`)

// process.on('SIGINT',  () => console.log('Received: SIGINT'))
// // process.on('SIGKILL', () => console.log('Received: SIGKILL'))
// process.on('SIGTERM', () => console.log('Received: SIGTERM'))

Promise.reject('hello, world')

setTimeout(() => {}, 1000000)