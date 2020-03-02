module.exports = {
    parser: 'babel-eslint',

    env: {
        browser: true,
        es6: true,
        node: true,
        jasmine: true,
    },

    extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:react/recommended'],
};