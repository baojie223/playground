const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021
  },
  rules: {
    'no-debugger': 'warn',
    'node/no-unsupported-features/es-syntax': 'off'
  },
  overrides: [
    {
      files: ['.eslintrc.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'node/no-unpublished-require': 'off'
      }
    }
  ]
})
