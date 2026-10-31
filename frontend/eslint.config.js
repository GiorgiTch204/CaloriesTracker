import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Fetching data on mount/param-change via useEffect is an intentional,
      // common pattern throughout this app (Dashboard, Diary, FoodDatabase,
      // AuthContext, etc.) — not an accidental cascading render.
      'react-hooks/set-state-in-effect': 'off',
      // Context files intentionally export a provider plus a paired hook
      // (useAuth, useTheme, useToast) and a couple of files export a small
      // helper alongside the component — this doesn't affect production
      // builds, only dev fast-refresh granularity.
      'react-refresh/only-export-components': 'off',
    },
  },
])
