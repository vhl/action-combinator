module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'rules': {
  },
  'overrides': [
    {
      files: ['**/*.js'],
      rules: {
        'indent': [
          'error', 2, {
            'CallExpression': {
              'arguments': 1,
            },
          },
        ],
      },
    },
    {
      files: ['**/*spec.js'],
      env: {
        jest: true,
      },
    },
  ],
};
