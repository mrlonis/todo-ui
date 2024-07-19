// @ts-check
import cypressEslint from 'eslint-plugin-cypress/flat';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [...cypressEslint.configs.recommended],
});
