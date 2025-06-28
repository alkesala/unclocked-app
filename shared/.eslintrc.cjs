module.exports = {
  root: true, // This tells ESLint to stop looking for config files in parent directories
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // Add any specific rules for your shared package here
    'no-unused-vars': 'warn',
  },
};
