module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'plugin:vue/essential',
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
    'parser': 'babel-eslint',
  },
  'parser': 'vue-eslint-parser',
  'plugins': [
    'vue',
  ],
  'rules': {
    'max-len': 'off',
    'vue/max-len': ['error', {
      'code': 80,
      'template': 120,
      'tabWidth': 2,
      'comments': 80,
      'ignorePattern': '',
      'ignoreComments': false,
      'ignoreTrailingComments': false,
      'ignoreUrls': false,
      'ignoreStrings': false,
      'ignoreTemplateLiterals': false,
      'ignoreRegExpLiterals': false,
      'ignoreHTMLAttributeValues': false,
      'ignoreHTMLTextContents': false,
    }],
  },
};
