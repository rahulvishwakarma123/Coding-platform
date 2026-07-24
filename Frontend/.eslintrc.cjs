module.exports = {
  // 1. Tell ESLint we are using a browser (window, document) and modern JS
  env: {
    browser: true,
    es2021: true,
  },

  // 2. Extend Airbnb and Prettier
  extends: [
    'airbnb-typescript',          // Airbnb rules for TypeScript
    'airbnb/hooks',               // Rules for React Hooks (useState, useEffect)
    'plugin:@typescript-eslint/recommended', // TypeScript specific checks
    'plugin:prettier/recommended', // MUST be last! Turns off rules that fight Prettier
  ],

  // 3. Tell ESLint how to read TypeScript files
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',   // Points to your TypeScript config
  },

  // 4. Tells React to auto-detect your version
  settings: {
    react: {
      version: 'detect',
    },
  },

  // 5. RULES: This is the "Beginner Safety Net" 
  rules: {
    // ---------- SAVES YOU FROM HEADACHES ----------
    // In React 17+, you DON'T need to import React just to use JSX.
    // Turning this off saves you from writing 'import React from "react"' 100 times.
    'react/react-in-jsx-scope': 'off',

    // Airbnb forces you to write "function Component() {}" but arrow functions
    // are easier for beginners. This allows both.
    'react/function-component-definition': 'off',

    // Airbnb forces you to add default props for every prop.
    // With TypeScript, this is redundant. Turning it off saves you boilerplate.
    'react/require-default-props': 'off',

    // Airbnb forces you to name your files "index.tsx". 
    // Turning this off lets you name files whatever you want (e.g., "HomePage.tsx").
    'import/prefer-default-export': 'off',

    // Spreading props {...props} is common in wrappers. 
    // This makes it a warning (yellow) instead of a hard error (red).
    'react/jsx-props-no-spreading': 'warn',

    // ---------- HANDLES TYPESCRIPT CONFUSION ----------
    // As a beginner, you won't always know the exact return type of a function.
    // If you forget to write ": React.FC", it will just WARN you, not break your flow.
    '@typescript-eslint/explicit-function-return-type': 'warn',

    // If you declare a variable but don't use it yet, it warns you gently.
    // If you put an underscore "_" before it, it ignores it (e.g., `_unusedProp`).
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // Allows you to use the 'any' type if you are stuck, but warns you to fix it later.
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};