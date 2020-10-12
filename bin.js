#!/usr/bin/env node
const extract = require('.')
const argv = require('minimist')(process.argv.slice(2))

if (argv.through) {
  process.stdin.pipe(extract(onMeta)).pipe(process.stdout)
} else {
  process.stdin.pipe(extract(onMeta))
}
process.stdin.resume()

function onMeta(err, meta) {
  if (err) {
    console.error(err.message)
    process.exit(1)
  }
  console[argv.through ? 'error' : 'log'](JSON.stringify(meta, null, 2))
}
