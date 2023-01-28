module.exports = {
  root: true,
  env: {
    node: true,
    webextensions: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'max-len': [2, 144],
    'object-curly-newline': [0],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      },
    },
  },
};
