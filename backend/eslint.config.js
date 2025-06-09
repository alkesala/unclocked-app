import eslintPluginTs from "@typescript-eslint/eslint-plugin"
import parserTs from "@typescript-eslint/parser"

export default [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: parserTs,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: ".",
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: { require: true, module: true },
        },
        plugins: {
            "@typescript-eslint": eslintPluginTs,
        },
        rules: {
            ...eslintPluginTs.configs.recommended.rules,
        },
    },
]
