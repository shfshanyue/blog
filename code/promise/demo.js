class Prom {
  static resolve (value) {
    if (value && value.then) {
      return value 
    }
    return new Prom(resolve => resolve(value))
  }

  constructor (fn) {
    this.value = undefined
    this.reason = undefined
    this.status = 'PENDING'
    this.resolveFns = []
    this.rejectFns = []

    const resolve = (value) => {
      setTimeout(() => {
        this.status = 'RESOLVED'
        this.value = value
        this.resolveFns.forEach(({ fn, resolve: res, reject: rej }) => res(fn(value)))
      })
    }

    const reject = (e) => {
      setTimeout(() => {
        this.status = 'REJECTED'
        this.reason = e
        this.rejectFns.forEach(({ fn, resolve: res, reject: rej }) => rej(fn(e)))
      })
    }

    fn(resolve, reject)
  }


  then (fn) {
    if (this.status === 'RESOLVED') {
      const result = fn(this.value)
      return Prom.resolve(result)
    }
    if (this.status === 'PENDING') {
      return new Prom((resolve, reject) => {
        this.resolveFns.push({ fn, resolve, reject }) 
      })
    }
  }

  catch (fn) {
    if (this.status === 'REJECTED') {
      const result = fn(this.value)
      return Prom.resolve(result)
    }
    if (this.status === 'PENDING') {
      return new Prom((resolve, reject) => {
        this.rejectFns.push({ fn, resolve, reject }) 
      })
    }
  }
}

const p = Prom.resolve(10).then(o => o * 10).then(o => o + 10)
p.then(o => console.log(o))

// return new Prom((resolve, reject) => reject('Error')).catch(e => {
//   console.log('Error', e)
// })

setTimeout(() => {
  p.then(o => console.log(o))
}, 1000)
