module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    "plugin:react/recommended",
    "standard"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'react/jsx-filename-extension': [1, {
      extensions: ['.js', '.jsx']
    }],
    'react/no-array-index-key': 0,
    'no-plusplus': 0,
    'react/jsx-props-no-spreading': 0,
    'prefer-spread': 0,
    'no-shadow': 'off'
  }
};
