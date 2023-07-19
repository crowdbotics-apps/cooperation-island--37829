module.exports = function override(config) {
    config.resolve = {
        fallback: {
            "react/jsx-runtime": "react/jsx-runtime.js",
        }
    };

    return config;
}