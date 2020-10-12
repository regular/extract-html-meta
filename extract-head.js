const Loner = require('loner')
const Bl = require('bl')

module.exports = cb =>{
  const loner = Loner('<head>', '<HEAD>', '</head>', '</HEAD>')
  let in_head = false
  const bl = Bl()
  loner.on('end', ()=>{
    if (cb) cb(new Error('No <head> tag found'))
    cb = null
  })
  loner.on('data' , data => {
    if (!cb) return
    const token = Buffer.isBuffer(data) ? data.toString('utf8') : data
    if (token.toLowerCase() == '<head>') in_head = true
    else if (token.toLowerCase() == '</head>') {
      cb(null, bl.slice())
      cb = null
    }
    else if (in_head) bl.append(data)
  })
  return loner
}
