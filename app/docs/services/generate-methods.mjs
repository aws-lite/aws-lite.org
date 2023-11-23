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
    if (!awsDoc) throw ReferenceError(`All methods must refer to an AWS service API doc: ${display} ${method}`)
    header += `<cite>[Canonical AWS API doc](${awsDoc})</cite>\n`
    if (validate) {
      header += `\n #### Properties\n` + '<dl>' + Object.entries(validate).map(([ param, values ]) => {
        const { type, required, comment } = values
        const _typ = Array.isArray(type) ? type.join(', ') : type
        const _req = required ? ' [required]' : ''
        // Newlines required in `dd` to preserve any markdown formatting contained in the comment
        const _com = comment ? `<dd>\n\n${comment}\n\n</dd>` : ''
        return `<dt><code>${param}</code> (${_typ})${_req}</dt>${_com}`
      }).join('\n') + '</dl>'
    }
    header += '\n\n</figure>'
    return header
  }).filter(Boolean).join('\n\n\n') + '\n'

  if (deprecatedMethods.length) {
    methodDocs += `\n\n## Deprecated methods\n\n` +
                  deprecatedMethods.map(({ method, awsDoc }) => awsDoc
                    ? `- [\`${method}\`](${awsDoc})`
                    : `- \`${method}\``
                  ).join('\n') + '\n'
  }
  if (incompleteMethods.length) {
    methodDocs += `\n\n## Methods yet to be implemented\n\n` +
                  `Please help out by [opening a PR](/contributing)!\n\n` +
                  incompleteMethods.map(({ method, awsDoc }) => awsDoc
                    ? `- [\`${method}\`](${awsDoc})`
                    : `- \`${method}\``
                  ).join('\n') + '\n'
  }
  return methodDocs
}
