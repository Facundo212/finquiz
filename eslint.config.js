import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

export default tseslint.config(
  { ignores: ['dist', 'src/components/ui/**/*'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...compat.extends('airbnb'),
      ...compat.extends('airbnb-typescript'),
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/jsx-props-no-spreading': 'off',
      'no-param-reassign': 'off',
      'react/jsx-closing-bracket-location': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'max-len': ['error', { code: 160 }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'no-underscore-dangle': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          '': 'never',
          'js': 'never',
          'jsx': 'never',
          'ts': 'never',
          'tsx': 'never'
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          'devDependencies': [
            'vite.config.ts'
          ],
          'optionalDependencies': false
        }
      ]
    },
  },
  {
    files: ['src/reducers/**/*'],
    rules: { 'no-param-reassign': ['error', { props: false }] },
  },
  {
    files: ['src/components/**/*', 'src/constants/**/*'],
    rules: { 'import/prefer-default-export': 'off' },
  },
  {
    files: ['src/components/scoreChart.tsx'],
    rules: { 'react/no-unstable-nested-components': 'off' },
  },
  {
    files: ['src/components/studyLink.tsx'],
    rules: { 'jsx-a11y/anchor-is-valid': 'off' },
  }
)
