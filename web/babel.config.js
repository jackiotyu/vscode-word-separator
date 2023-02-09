module.exports = {
    presets: [
        [
            '@vue/cli-plugin-babel/preset',
            {
                useBuiltIns: 'usage', // "usage" | "entry" | false, defaults to false.
                corejs: '3.0.0',
            },
        ],
    ],
};
