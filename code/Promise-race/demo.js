Promise.fakeRace = ps => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < ps.length; i++) {
      ps.then(resolve).catch(reject)
    }
  })
}

Promise.race([3, 4])
