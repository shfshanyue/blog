function is(value, type) {
  return {}.toString.call(value) === `[object ${type}]`
}

function isRegExp (value) {
  return is(value, 'ExgExp')
}

function isDate (value) {
  return is(value, 'Date')
}

function isPromise (value) {
  return is(value, 'Promise')
}

function isArray (value) {
  return Array.isArray(value)
}

function clone (value) {
  if (typeof value !== 'object') {
    return value
  }
  if (isArray(value)) {
    return value.map(x => clone(x))
  }
  if (isPromise(value)) {
    return value
  }
}