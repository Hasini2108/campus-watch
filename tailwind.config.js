/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#6366F1',
                    600: '#4F46E5',  // Main Primary
                    700: '#4338CA',
                    800: '#3730A3',
                    900: '#312E81',
                },
                accent: {
                    50: '#FDF2F8',
                    100: '#FCE7F3',
                    200: '#FBCFE8',
                    300: '#F9A8D4',
                    400: '#F472B6',
                    500: '#EC4899',  // Main Accent
                    600: '#DB2777',
                    700: '#BE185D',
                    800: '#9D174D',
                    900: '#831843',
                },
                success: {
                    50: '#ECFDF5',
                    500: '#10B981',
                    600: '#059669',
                },
                warning: {
                    50: '#FFFBEB',
                    500: '#F59E0B',
                    600: '#D97706',
                },
                danger: {
                    50: '#FEF2F2',
                    500: '#EF4444',
                    600: '#DC2626',
                },
                surface: '#FFFFFF',
                background: '#F3F4F6',
                glass: 'rgba(255, 255, 255, 0.7)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backdropBlur: {
                glass: '10px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.06)',
                'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
                'primary-glow': '0 4px 20px rgba(79, 70, 229, 0.4)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};
