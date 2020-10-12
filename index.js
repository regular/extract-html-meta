const extractHead = require('./extract-head')
const parse = require('./parse')

module.exports = function(cb) {
  const e = extractHead( (err, buff) => {
    if (err) return cb(err)
    const meta = parse(buff.toString())
    cb(null, meta)
  })
  return e
}
