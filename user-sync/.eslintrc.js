module.exports = {
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    extends: ['eslint:recommended', 'google'],
    rules: {
        'no-restricted-globals': ['error', 'name', 'length'],
        'prefer-arrow-callback': 'error',
        quotes: ['error', 'single', { allowTemplateLiterals: true }], // Используйте одинарные кавычки
        'linebreak-style': ['error', 'unix'], // Использование LF
        'max-len': ['error', { code: 150 }], // Максимальная длина строки 150
        indent: ['error', 4, { SwitchCase: 1 }], // Использование 4 пробелов для отступов
        semi: ['error', 'always'], // Обязательно ставить точку с запятой
        'comma-dangle': ['error', 'es5'], // Запятая в конце последнего элемента в объектах и массивах
        'brace-style': ['error', 'stroustrup'], // Стиль фигурных скобок
        'no-multiple-empty-lines': ['error', { max: 1 }], // Максимум одна пустая строка
    },
    overrides: [
        {
            files: ['**/*.spec.*'],
            env: {
                mocha: true,
            },
            rules: {},
        },
    ],
    globals: {},
};
