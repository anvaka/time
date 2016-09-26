module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    'import/no-unresolved': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-use-before-define': 0,
    'no-restricted-syntax': 0,
    'semi': 0,
    'prefer-const': 0,
    'no-multiple-empty-lines': 0,
    'object-curly-spacing': 0,
    'comma-dangle': 0,
  },
  globals: {
    gapi: true
  }
}
