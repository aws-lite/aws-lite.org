const arc = require('@architect/eslint-config')

module.exports = [
  ...arc,
  {
    files: [ 'app/**/*.mjs' ],
    rules: {
      'arc/match-regex': 'off',
    },
  },
]
