/** @type {import("prettier").Config} */
const config = {
    singleQuote: false,
    arrowParens: "always",
    trailingComma: "none",
    printWidth: 80,
    tabWidth: 4,
    plugins: ["prettier-plugin-tailwindcss"]
};

module.exports = config;
