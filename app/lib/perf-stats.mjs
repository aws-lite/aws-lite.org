const metrics = [
  // 'min',
  // 'max',
  'mean',
  // 'median',
  'stddev',
  // 'p25',
  'p50',
  'p90',
  'p95',
  'p99',
]
const names = {
  'aws-lite-raw': '`aws-lite`',
  'aws-lite-bundled': '`aws-lite` (bundled)',
  'aws-sdk-v2-raw': '`aws-sdk` (v2)',
  'aws-sdk-v2-bundled': '`aws-sdk` (v2, bundled)',
  'aws-sdk-v3-raw': '`@aws-sdk` (v3)',
  'aws-sdk-v3-bundled': '`@aws-sdk` (v3, bundled)',
}

export default function (data, /* checksum */) {
  let md = {}
  Object.entries(data).forEach(([ name, data ]) => {
    md[name] = '<figure class="table-wrapper">\n\n'
    md[name] += `| | ` + Object.keys(data).map(n => names[n]).join(' | ') + ' |\n'
    md[name] += `|-` + `|-`.repeat(Object.keys(data).length) + ' |\n'
    metrics.forEach(m => {
      md[name] += `| ${m} | ` + Object.values(data).map(d => Number(d[m])).join(' | ') + ' |\n'
    })
    md[name] += '\n\n</figure>'
  })
  return md
}
