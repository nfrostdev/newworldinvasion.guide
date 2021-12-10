module.exports = {
    purge: {
        enabled: true,
        content: [
            "./layouts/**/*.html",
            "./content/**/*.md",
            "./content/**/*.html",
            "./assets/**/*.js",
        ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'nw-lightgray': '#d5d5d5',
                'nw-gray': '#272624',
                'nw-darkgray': '#1a1918',
                'nw-orange': '#ffb10f',
                'nw-gold': '#fff1ce'
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
