/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '1.5rem',
            screens: {
                '2xl': '1320px',
            },
        },
        extend: {
            colors: {
                border: 'var(--color-border)',
                input: 'var(--color-input)',
                ring: 'var(--color-ring)',
                background: 'var(--color-background)',
                foreground: 'var(--color-foreground)',
                surface: {
                    DEFAULT: 'var(--color-surface)',
                    2: 'var(--color-surface-2)',
                },
                navy: {
                    DEFAULT: 'var(--color-navy)',
                    foreground: 'var(--color-navy-foreground)',
                },
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    foreground: 'var(--color-primary-foreground)',
                    strong: 'var(--color-primary-strong)',
                    tint: 'var(--color-primary-tint)',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    foreground: 'var(--color-secondary-foreground)',
                },
                green: {
                    DEFAULT: 'var(--color-green)',
                    foreground: 'var(--color-green-foreground)',
                    bright: 'var(--color-green-bright)',
                    tint: 'var(--color-green-tint)',
                },
                gold: {
                    DEFAULT: 'var(--color-gold)',
                    foreground: 'var(--color-gold-foreground)',
                    strong: 'var(--color-gold-strong)',
                    tint: 'var(--color-gold-tint)',
                },
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    foreground: 'var(--color-accent-foreground)',
                },
                destructive: {
                    DEFAULT: 'var(--color-destructive)',
                    foreground: 'var(--color-destructive-foreground)',
                },
                muted: {
                    DEFAULT: 'var(--color-muted)',
                    foreground: 'var(--color-muted-foreground)',
                },
                popover: {
                    DEFAULT: 'var(--color-popover)',
                    foreground: 'var(--color-popover-foreground)',
                },
                card: {
                    DEFAULT: 'var(--color-card)',
                    foreground: 'var(--color-card-foreground)',
                },
                success: {
                    DEFAULT: 'var(--color-success)',
                    foreground: 'var(--color-success-foreground)',
                },
                warning: {
                    DEFAULT: 'var(--color-warning)',
                    foreground: 'var(--color-warning-foreground)',
                },
                error: {
                    DEFAULT: 'var(--color-error)',
                    foreground: 'var(--color-error-foreground)',
                },
                brand: {
                    primary: 'var(--color-brand-primary)',
                    secondary: 'var(--color-brand-secondary)',
                },
                conversion: {
                    accent: 'var(--color-conversion-accent)',
                },
                trust: {
                    builder: 'var(--color-trust-builder)',
                },
                cta: 'var(--color-cta)',
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    faint: 'var(--color-text-faint)',
                },
            },
            fontFamily: {
                sans: ['var(--font-body)', 'Satoshi', 'system-ui', 'sans-serif'],
                body: ['var(--font-body)', 'Satoshi', 'system-ui', 'sans-serif'],
                display: ['var(--font-display)', 'Clash Display', 'sans-serif'],
            },
            fontSize: {
                'display-2xl': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '0.98', fontWeight: '600', letterSpacing: '-0.03em' }],
                'display-xl': ['clamp(2.75rem, 6.5vw, 5rem)', { lineHeight: '1.0', fontWeight: '600', letterSpacing: '-0.025em' }],
                'display-lg': ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.04', fontWeight: '600', letterSpacing: '-0.02em' }],
                'display-md': ['clamp(1.875rem, 3.6vw, 2.75rem)', { lineHeight: '1.08', fontWeight: '600', letterSpacing: '-0.02em' }],
                'display-sm': ['clamp(1.5rem, 2.6vw, 2rem)', { lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.015em' }],
                'heading-lg': ['clamp(1.375rem, 2vw, 1.75rem)', { lineHeight: '1.2', fontWeight: '600' }],
                'heading-md': ['clamp(1.25rem, 1.6vw, 1.5rem)', { lineHeight: '1.25', fontWeight: '600' }],
                'heading-sm': ['1.25rem', { lineHeight: '1.35', fontWeight: '600' }],
                'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
                'body-md': ['1rem', { lineHeight: '1.65', fontWeight: '400' }],
                'body-sm': ['0.875rem', { lineHeight: '1.55', fontWeight: '400' }],
            },
            spacing: {
                'base': 'var(--spacing-base)',
                'rhythm': 'var(--vertical-rhythm)',
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
            },
            boxShadow: {
                'subtle': '0 4px 6px -1px rgba(11, 31, 77, 0.08), 0 2px 4px -1px rgba(11, 31, 77, 0.05)',
                'elevation': '0 18px 40px -18px rgba(11, 31, 77, 0.25)',
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
            transitionDuration: {
                'smooth': '300ms',
                'reveal': '400ms',
                'quick': '200ms',
            },
        },
    },
    plugins: [],
};
