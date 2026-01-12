/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            colors: {
                primary: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ec4899',
                    600: '#db2777', // Main brand pink
                    700: '#be185d',
                    800: '#9d174d',
                    900: '#831843',
                },
                gold: {
                    100: '#fbf5e6',
                    200: '#f3e6c5',
                    300: '#ead29c',
                    400: '#e0bc70',
                    500: '#d4a34b', // Gold main
                    600: '#aa7e35',
                },
                dark: {
                    800: '#1f1d1d',
                    900: '#121212',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern': "url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=2000')", // Elegant salon bg
            }
        },
    },
    plugins: [],
}
