/**
 * MIT License
 *
 * Copyright (c) 2026 rainy-juzixiao
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
    rules: {
        // TypeScript rules
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/prefer-as-const": "off",
        "@typescript-eslint/no-unused-disable-directive": "off",

        // React rules
        "react-hooks/exhaustive-deps": "off",
        "react-hooks/purity": "off",
        "react/no-unescaped-entities": "off",
        "react/display-name": "off",
        "react/prop-types": "off",
        "react-compiler/react-compiler": "off",

        // Next.js rules
        "@next/next/no-img-element": "off",
        "@next/next/no-html-link-for-pages": "off",

        // General JavaScript rules
        "prefer-const": "off",
        "no-unused-vars": "off",
        "no-console": "off",
        "no-debugger": "off",
        "no-empty": "off",
        "no-irregular-whitespace": "off",
        "no-case-declarations": "off",
        "no-fallthrough": "off",
        "no-mixed-spaces-and-tabs": "off",
        "no-redeclare": "off",
        "no-undef": "off",
        "no-unreachable": "off",
        "no-useless-escape": "off",

        'curly': ['error', 'all'],
    },
}, {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "examples/**", "skills"]
}];

export default eslintConfig;