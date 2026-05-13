import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // 1. Fontes Unificadas (Jost para Títulos/Logos, Inter para Textos)
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],    
                heading: ["var(--font-jost)", "sans-serif"], 
                jost: ["var(--font-jost)", "sans-serif"],
            },
            // 2. Cores: Hooke 900 agora é PRETO PURO (#000)
            colors: {
                hooke: {
                    '50': 'hsl(var(--hooke-100))',
                    '100': 'hsl(var(--hooke-100))',
                    '200': 'hsl(var(--hooke-200))',
                    '300': 'hsl(var(--border))',
                    '400': 'hsl(var(--hooke-400))',
                    '500': 'hsl(var(--muted-foreground))',
                    '600': 'hsl(var(--hooke-700))',
                    '700': 'hsl(var(--hooke-700))',
                    '800': 'hsl(var(--hooke-800))',
                    '900': 'hsl(var(--hooke-900))', 
                    DEFAULT: 'hsl(var(--hooke-900))',
                    'paper': 'hsl(var(--hooke-paper))',
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
            },
            // 3. Bordas Zero (Sharp / Brutalista)
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                DEFAULT: '0px', 
            },
            // 4. Animações
            animation: {
                marquee: 'marquee 25s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
            boxShadow: {
                'none': '0 0 #0000',
                'subtle': '0 2px 10px rgba(0,0,0,0.02)',
                'editorial': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            },
        }
    },
    plugins: [
        tailwindcssAnimate,
        typography,
    ],
};
export default config;