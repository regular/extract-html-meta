html-meta-meta
---
The inverse of [html-inject-meta](https://npmjs.com/packages/html-inject-meta)


## Example

``` js
const extract = require('html-extract-meta')
process.stdin.pipe(extract(onMeta))
process.stdin.resume()

function onMeta(err, meta) {
  ...
}
```

## API

`extract(cb)` returns a transparent trhough stream (its output is the same as its input). Upon having seen the `<head>` tag in the input, it calls `cb(err, meta)`, where meta has these propertues:

  - name
  - description
  - author
  - generator (coming from `<meta name="generator">`
  - http (an object with http headers coming from `<meta http-equiv>` tags

If there are meta tags with name or property attributes containing a colon (:), they are considered "namespaced meta tags" and occur in meta.namespaced. For example, `<meta name="twitter:creator" conent="regular"/>` shows up as `meta.namespaced.twitter.ceator`

## CLI

`html-extract-meta < in.html > out.json [--through]`

Reads html from stdin and outputs meta json to stdout. if `--through` is given, outputs meta json to stderr and outputs html to stdout.

License: MIT
