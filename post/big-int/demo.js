
//  12
// 123
// 135
function add (x, y) {
  let sum = ''
  let len = x.length > y.length ? x.length : y.length
  let to = 0
  const rx = Array.from(x).reverse()
  const ry = Array.from(y).reverse()
  console.log(rx, ry)
  for (let i=0; i<len; i++) {
    s = Number(rx[i] || 0) + Number(ry[i] || 0) + to
    if (s > 9) {
      to = 1
    }
    sum = s % 10 + sum
  }
  return sum
}

// 112 * 12 = 144
function multi (x, y) {
  let multi = []
  const rx = Array.from(x, Number).reverse()
  const ry = Array.from(y, Number).reverse()
  const xLen = rx.length
  const yLen = ry.length
  for (let i=0; i<xLen; i++) {
    for (let j=0;j<xLen; j++) {
      // 136
      let m = rx[i] * ry[j]
      let to = 0
      while (m) {
        m = m + (multi[i+j+to] || 0)
        multi[i+j+to] = m % 10
        m = parseInt(m / 10)
        to++
      }
    }
  }
  return multi
}

console.log(multi('99999', '999999'))
console.log(multi('12', '12'))
