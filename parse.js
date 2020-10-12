const x = require('xmldom')
const debug = require('debug')('html-extract-meta:parse')

const META_NAMES = {
  'application-name': 'name',
  'subject': 'description',
  'abstract': 'description',
  'twitter:title': 'name',
  'description': 'description',
  'twitter:description': 'description',
  'author': 'author',
  'twitter:creator': 'author',
  'generator': 'generator'
}

const META_PROPERTIES = {
  'og:title': 'name', 
  'og:description': 'description',
  'article:author': 'author'
}

module.exports = function(html) {
  const parser = new x.DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const tags = []
  let lastVisited

  function visit(n, attrs, parent) {
    const {nodeType, nodeName, nodeValue} = n
    if (nodeName == '#text' && parent) {
      parent.text = nodeValue
      return
    }

    lastVisited = {
      tagName: nodeName,
      attrs
    }
    tags.push(lastVisited)
    return lastVisited
  }
  walk(doc.firstChild, visit)
  return extract(tags)
}

function extract(tags) {
  const http = {}
  const entries = []
  for(let tag of tags) {
    const {tagName, attrs, text} = tag
    if (tagName == 'title') entries.push(['name', text])
    else if (tagName == 'meta') {
      const http_header = attrs['http-equiv']
      const {content, name, property} = attrs
      if (http_header) {
        http[http_header] = content
        continue;
      }
      let key, value = content
      if (name == 'keywords' && content) {
        key = 'keywords'
        value = content.split(',')
      } else if (name && META_NAMES[name]) {
        key = META_NAMES[name]
      } else if (property && META_PROPERTIES[property]) {
        key = META_PROPERTIES[property]
      }
      if (value && key) {
        entries.push([key, value])
      } else {
        debug('ignoring meta tag: name="%s", property="%s", content="%s"', name, property, content)
      }
    }
  }
  if (Object.keys(http).length) entries.push(['http', http])
  return Object.fromEntries(entries)
}

function walk(n, visit) {
  traverse(n)

  function traverse(n, parent) {
    const attrs = []
    if (n.attributes) {
      for(let i=0; i<n.attributes.length; ++i) {
        const {nodeName, nodeValue} = n.attributes[i]
        attrs.push([nodeName, nodeValue])
      }
    }
    const e = visit(n, Object.fromEntries(attrs), parent)
    if (n.firstChild) traverse(n.firstChild, e)
    if (n.nextSibling) traverse(n.nextSibling, parent)
  }
}
