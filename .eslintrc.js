module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/prefer-default-export': 0,
    'no-unused-vars': 0,
    'no-plusplus': 0,
    'no-undef': 0,
    'class-methods-use-this': 0,
    'import/extensions': 0,
    'implicit-arrow-linebreak': 0,
    'no-await-in-loop': 0,
    'no-console': 0,
  },
};
