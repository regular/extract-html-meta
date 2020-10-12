const fs = require('fs')
const test = require('tape')
const Bl = require('bl')
const extractHead = require('./extract-head')
const extractMeta = require('.')
const parse = require('./parse')

test('extract-head', t => {
  const e = extractHead( (err, head) => {
    t.error(err)
    t.equal(head.toString(), 'foo')
    t.end()
  })
  Bl('x<head>foo</head>y').pipe(e)
})

test('extract-head errors when there is no <head>', t => {
  const e = extractHead( (err, head) => {
    t.ok(err)
    t.end()
  })
  Bl('x<head>foo').pipe(e)
})

test('parse HTML', t=>{
  const result = parse('<html><head><title>foo</title>/head></html>')
  t.deepEqual(result, {name: 'foo'})
  t.end()
})

test('parse example HEAD element', t=>{
  const result = parse(fs.readFileSync('./fixtures/head', 'utf8'))
  t.deepEqual(result, {
    name: 'time-spiral',
    description: 'time-tracking (a Bay-of-Plenty demo)',
    author: 'Jan Bölsche <jan@lagomorph.de> (https://regular.codes/)',
    generator: 'tre-compile 1.3.1',
    keywords: [ 'tre', 'bay-of-plenty', 'ssb', 'time tracking' ],
    http: {
      'Content-Security-Policy': 'script-src \'sha256-Nn/H6T+T7/6qVeydXJiRn9nIngPKtDcKkAZhUPBfh4c=\';'
    } 
  })

  t.end()
})

test('extract meta', t =>{
  const html = `
  <html>
    <head>
      <title>foo</title>
    </head>
  </html>`
  const out = Bl()
  const bl = Bl(html)

  const e = extractMeta( (err, meta) => {
    t.error(err)
    t.equal(meta.name, 'foo')
  })
  bl.pipe(e).pipe(out)
  bl.on('end', ()=>{
    t.equal(out.toString(), html)
    t.end()
  })
})
