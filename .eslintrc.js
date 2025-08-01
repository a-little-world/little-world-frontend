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
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.tsx', '.ts'] },
    ],
    'react/jsx-indent-props': [2, 2],
    'react/jsx-indent': [2, 2],
    'react/jsx-one-expression-per-line': [0],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-no-bind': 'off',
    'react/prefer-stateless-function': [1],
    'react/static-property-placement': [1, 'property assignment'],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': ['off'],
    'react/function-component-definition': 'off',
    'react/require-default-props': 'off',
    'import/extensions': 'off',
    'arrow-parens': 'off',
    'operator-linebreak': [1, 'after'],
    'no-confusing-arrow': 0,
    'no-unused-vars': 0,
    'no-nested-ternary': 1,
    'no-plusplus': 1,
    camelcase: 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_|^[a-z]+$', // Allow single lowercase letters (common in interfaces)
        varsIgnorePattern: '^_|^[A-Z_]+$|^[a-z]+$', // Allow UPPER_CASE (enums, constants) and lowercase (enum values)
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
    {
      files: ['*.jsx', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_|^[a-z]+$', // Allow single lowercase letters (common in interfaces)
            varsIgnorePattern: '^_|^React$|^[A-Z_]+$|^[a-z]+$', // Allow UPPER_CASE (enums, constants) and lowercase (enum values)
            caughtErrorsIgnorePattern: '^_',
          },
        ],
        'no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_|^[a-z]+$', // Allow single lowercase letters (common in interfaces)
            varsIgnorePattern: '^_|^React$|^[A-Z_]+$|^[a-z]+$', // Allow UPPER_CASE (enums, constants) and lowercase (enum values)
            caughtErrorsIgnorePattern: '^_',
          },
        ],
      },
    },
  ],
};
