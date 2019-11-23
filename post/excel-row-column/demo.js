function f (column) {
  return column.toUpperCase().charCodeAt() - 'A'.charCodeAt() + 1
}

function rf (row) {
  return String.fromCharCode(64 + row)
}

function columnToRow (column) {
  // return Array.from(column).reduceRight((sum, x, i) => {
  //   return sum + f(x) * (26 ** i)
  // }, 0)
  let to = 0
  let sum = 0
  for (let x of column) {
    sum = sum + f(x) * (26 ** to)
    to++
  }
  return sum
}


// 10  -> aa   -> 26 ** 1 + 0
// 100 -> aaa  -> 26 ** 2 + 0
// 110 -> aba  -> 26 ** 2 + 26 + 0
// 111 -> abb
// 123 -> acd  -> 26 ** 2 * 1 + 26 * 2 + 3
function rowToColumn (row) {
  let column = ''
  while (row) {
    c = row % 26
    row = parseInt(row / 26)
    if (c === 0) {
      c = 26
      row = row - 1
    }
    column = rf(c) + column
  }
  return column
}

function getCell(cell) {
  return cell.split('\d')
}

console.log(rowToColumn(18278))
console.log(columnToRow('ZZZ'))
