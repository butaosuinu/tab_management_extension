import love from 'eslint-config-love'
import oxlint from 'eslint-plugin-oxlint'

export default [
  {
    ignores: ['dist/**', '.output/**', '.wxt/**', 'node_modules/**', 'coverage/**'],
  },
  {
    ...love,
    files: ['**/*.ts'],
    languageOptions: {
      ...love.languageOptions,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      ...love.rules,
      // Allow magic numbers for simple cases
      '@typescript-eslint/no-magic-numbers': 'off',
      // Browser extension APIs have complex types
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // Use default behavior for return await
      '@typescript-eslint/return-await': 'off',
    },
  },
  ...oxlint.configs['flat/recommended'],
]
