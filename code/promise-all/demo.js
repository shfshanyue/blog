function pAll (promises) {
  return new Promise((resolve, reject) => {
    const r = []
    const len = promises.length
    let count = 0
    for (let i = 0; i < len; i++) {
      Promise.resolve(promises[i]).then(o => { 
        r[i] = o;
        if (++count === len) {
          resolve(r)
        }
      }).catch(e => reject(e))
    }
  })
}

const sleep = (seconds) => new Promise(resolve => setTimeout(() => resolve(seconds), seconds))

pAll([1, 2, 3]).then(o => console.log(o))
pAll([
  sleep(3000),
  sleep(2000),
  sleep(1000)
]).then(o => console.log(o))
pAll([
  sleep(3000),
  sleep(2000),
  sleep(1000),
  Promise.reject(10000)
]).then(o => console.log(o)).catch(e => console.log(e, '<- Error'))