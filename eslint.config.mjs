import config from '@iobroker/eslint-config';

export default [
    ...config,
    {
        ignores: [
            '.dev-server/',
            '.vscode/',
            '*.test.js',
            'test/**/*.js',
            '*.config.mjs',
            'build',
            'dist',
            'admin/build', 
            'admin/words.js',
            'admin/admin.d.ts',
            'admin/blockly.js',
            '**/adapter-config.d.ts',
        ],
    },
    {
        rules: {
            'no-console': 'off',
            'no-var': 'error',
            'no-trailing-spaces': 'error',
            'prefer-const': 'error',
            'quotes': ['error', 'double', { avoidEscape: true, allowTemplateLiterals: true }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            'semi': ['error', 'always'],
        },
    },
];