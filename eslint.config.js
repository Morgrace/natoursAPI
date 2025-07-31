import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  // Environments: give you Node and ES2021 globals
  env: {
    node: true,
    es2021: true,
  },

  // Let ESLint know you’re using ESM
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  // Plugins
  plugins: {
    js,
  },

  // Base configs to extend
  extends: [
    'js/recommended', // From @eslint/js
    'plugin:node/recommended', // Node-specific best practices
    'prettier', // Turn off rules that conflict with Prettier
  ],

  // Your custom rules
  rules: {
    semi: ['warn', 'always'], // always use semicolons
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // unused vars warn
    'no-console': 'off', // allow console.log
    'consistent-return': 'warn', // require return statements
  },

  // Override for test files (Jest, Mocha, etc.)
  overrides: [
    {
      files: ['**/*.test.{js,mjs,cjs}'],
      env: {
        jest: true,
      },
      // you can add test-specific rules here
    },
  ],
});
