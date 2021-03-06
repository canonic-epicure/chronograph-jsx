module.exports = {
    root    : true,
    parser  : '@typescript-eslint/parser',
    plugins : [
        '@typescript-eslint',
    ],
    extends : [
    ],
    rules : {
        'quote-props'           : [ 'warn', 'as-needed' ],
        indent                  : [ 'warn', 4 ],
        semi                    : [ 'warn', 'never' ],
        quotes                  : [ 'warn', 'single' ],
        'unicode-bom'           : [ 'error', 'never' ],
        'comma-spacing'         : [ 'error', { before : false, after : true } ],
        'array-bracket-spacing' : [ 'warn', 'always', { 'singleValue' : true } ],
        'object-curly-spacing'  : [ 'warn', 'always' ],
        'key-spacing'           : [ 'warn',
            {
                beforeColon : true,
                afterColon  : true,
                mode        : 'minimum'
            }
        ]
    }
}

