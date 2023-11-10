export default function generateMethods (_plugin) {
  const { display } = _plugin

  let deprecatedMethods = []
  let incompleteMethods = []
  let methodDocs = Object.keys(_plugin.methods).map(method => {
    let header = `### \`${method}\`\n\n`
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
    header += `[Canonical AWS API doc](${awsDoc})\n`
    if (validate) {
      header += `\nProperties:\n` + Object.entries(validate).map(([ param, values ]) => {
        const { type, required, comment } = values
        const _typ = Array.isArray(type) ? type.join(', ') : type
        const _req = required ? ' [required]' : ''
        const _com = comment ? `\n  - ${comment}` : ''
        return `- **\`${param}\` (${_typ})${_req}**${_com}`
      }).join('\n')
    }
    return header
  }).filter(Boolean).join('\n\n\n') + '\n'

  if (deprecatedMethods.length) {
    methodDocs += `\n\n### Deprecated methods\n\n` +
                  deprecatedMethods.map(({ method, awsDoc }) => awsDoc
                    ? `- [\`${method}\`](${awsDoc})`
                    : `- \`${method}\``
                  ).join('\n') + '\n'
  }
  if (incompleteMethods.length) {
    methodDocs += `\n\n### Methods yet to be implemented\n\n` +
                  `> Please help out by [opening a PR](https://github.com/architect/aws-lite#authoring-aws-lite-plugins)!\n\n` +
                  incompleteMethods.map(({ method, awsDoc }) => awsDoc
                    ? `- [\`${method}\`](${awsDoc})`
                    : `- \`${method}\``
                  ).join('\n') + '\n'
  }
  return methodDocs
}
