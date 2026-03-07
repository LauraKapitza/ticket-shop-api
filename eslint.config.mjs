// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import jestPlugin from 'eslint-plugin-jest';

export default tsEslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    files: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': 'error',
    },
  },
);
