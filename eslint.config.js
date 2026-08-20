import { globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  globalIgnores(['.next', 'node_modules']),
  ...nextCoreWebVitals,
  ...nextTypescript,
]

export default eslintConfig
