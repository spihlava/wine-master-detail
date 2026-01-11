import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                wine: {
                    50: '#fdf2f4',
                    100: '#fce7eb',
                    200: '#f9d0d9',
                    300: '#f4a9ba',
                    400: '#ec7794',
                    500: '#df4d70',
                    600: '#c92d56',
                    700: '#a82347',
                    800: '#8b2040',
                    900: '#761e3b',
                    950: '#420c1c',
                },
            },
        },
    },
    plugins: [],
}
export default config
