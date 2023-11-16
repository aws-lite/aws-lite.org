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

export default function (data, /* checksum */) {
  let md = {}
  Object.entries(data).forEach(([ name, data ]) => {
    md[name] = ''
    md[name] += `| | ` + Object.keys(data).join(' | ') + ' |\n'
    md[name] += `|-` + `|-`.repeat(Object.keys(data).length) + ' |\n'
    metrics.forEach(m => {
      md[name] += `| ${m} | ` + Object.values(data).map(d => Number(d[m])).join(' | ') + ' |\n'
    })
  })
  return md
}
