module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  },
  env: {
    browser: true,
  },
  extends: ['airbnb-base', 'plugin:vue/essential', '@vue/airbnb'],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
  // add your custom rules here
  'rules': {
      // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-else-return': 0,
    'keyword-spacing': 0,
    'no-underscore-dangle': 0,
    'import/newline-after-import': 0,
    'no-multiple-empty-lines': 0,
    'vue/max-attributes-per-line': 0,
    'vue/attributes-order': 0,
    'vue/component-name-in-template-casing': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/mustache-interpolation-spacing': 0,
    'vue/attribute-hyphenation': 0,
    'vue/valid-v-slot': 'off',
    'import/extensions': 'off',
    // 'vue/html-closing-bracket-spacing': 0,
    'max-len': [2, {
      code: 150,
      ignoreComments: true,
      ignoreTrailingComments: true,
    }],
  }
}