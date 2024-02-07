module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['prettier', 'react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-indent-props': [2, 2],
    'react/jsx-indent': [2, 2],
    'react/jsx-one-expression-per-line': [0],
    'react/jsx-props-no-spreading': 'off',
    'react/prefer-stateless-function': [1],
    'react/static-property-placement': [1, 'property assignment'],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': ['off'],
    'react/function-component-definition': 'off',
    'arrow-parens': 'off',
    'object-curly-newline': { "multiline": true },
    camelcase: 'warn',
  },
};
