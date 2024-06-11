const fenceStart = '```javascript'
const fenceEnd = '```'
const reqDoc = ' [required]'
const reqComment = ' // required'
const types = {
  array: 'Array',
  boolean: 'Boolean',
  buffer: 'Buffer',
  number: 'Number',
  object: 'Object',
  stream: 'Stream',
  string: 'String',
}

export default function generateMethods (_plugin) {
  const { display } = _plugin

  let deprecatedMethods = []
  let incompleteMethods = []
  let methodDocs = Object.keys(_plugin.methods).map(method => {
    let header = `<figure><figcaption>\n\n### \`${method}\`\n\n</figcaption>\n\n`
    if (_plugin.methods[method].deprecated) {
      let item = { method }
      if (_plugin.methods[method]?.awsDoc) item.awsDoc = _plugin.methods[method].awsDoc
      deprecatedMethods.push(item)
      return
    }
    if (!_plugin.methods[method] || _plugin.methods[method].disabled) {
      let item = { method }
      if (_plugin.methods[method]?.awsDoc) item.awsDoc = _plugin.methods[method].awsDoc
      incompleteMethods.push(item)
      return
    }
    const { awsDoc, validate } = _plugin.methods[method]
    if (!awsDoc && awsDoc !== false) {
      throw ReferenceError(`All methods must refer to an AWS service API doc: ${display} ${method}`)
    }
    if (awsDoc) {
      header += `<cite>[Canonical AWS API doc](${awsDoc})</cite>\n`
    }
    if (validate) {
      header += `\n #### Properties\n` + '<dl>' + Object.entries(validate).map(([ param, values ]) => {
        const { type, required, comment, ref } = values
        const _typ = Array.isArray(type) ? type.join(', ') : type
        const _req = required ? reqDoc : ''
        // Newlines required in `dd` to preserve any markdown formatting contained in the comment
        const _com = comment ? `<dd>\n\n${comment}\n\n</dd>` : ''
        const _ref = ref ? `<dd><a href="${ref} target=_blank>More details (AWS)</a></dd>` : ''
        return `<dt><code>${param}</code> (${_typ})${_req}</dt>${_com}${_ref}`
      })
        .sort((a, b) => {
          if (a.includes(reqDoc) && b.includes(reqDoc)) return a > b ? 1 : -1
          if (a.includes(reqDoc)) return -1
          if (b.includes(reqDoc)) return 1
          return a > b ? 1 : -1
        })
        .join('\n') + '</dl>'
    }
    header += '\n\n' + getExample(_plugin, method)
    header += '\n\n</figure>'
    return header
  }).filter(Boolean).join('\n\n\n') + '\n'

  if (deprecatedMethods.length) {
    methodDocs += `\n\n## Deprecated methods\n\n` +
                  deprecatedMethods.map(({ method, awsDoc }) => awsDoc
                    ? `- [\`${method}\`](${awsDoc})`
                    : `- \`${method}\``,
                  ).join('\n') + '\n'
  }
  if (incompleteMethods.length) {
    methodDocs += `\n\n## Methods yet to be implemented\n\n` +
                  `Please help out by [opening a PR](/contributing)!\n\n` +
                  incompleteMethods.map(({ method, awsDoc }) => awsDoc
                    ? `- [\`${method}\`](${awsDoc})`
                    : `- \`${method}\``,
                  ).join('\n') + '\n'
  }
  return methodDocs
}

function getExample (_plugin, method) {
  const v = _plugin.methods[method].validate
  let params = ''
  if (Object.keys(v).length) {
    const props = Object.entries(v)
      .reduce((acc, [ prop, deets ]) => {
        const type = Array.isArray(deets.type)
          ? deets.type.map(d => types[d]).join(' || ')
          : types[deets.type]
        let item = `  ${prop}: ${type},`
        if (deets.required) item += reqComment
        acc.push(item)
        return acc
      }, [])
      .sort((a, b) => {
        if (a.endsWith(reqComment) && b.endsWith(reqComment)) return a > b ? 1 : -1
        if (a.endsWith(reqComment)) return -1
        if (b.endsWith(reqComment)) return 1
        return a > b ? 1 : -1
      })
      .join('\n')
    params = '{\n' + props + '\n}'
  }
  const code = `await aws.${_plugin.property}.${method}(${params})`

  const example = [
    '#### Example',
    fenceStart,
    code,
    fenceEnd,
  ]
  return example.join('\n')
}
