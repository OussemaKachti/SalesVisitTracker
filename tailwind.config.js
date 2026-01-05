/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* white with opacity */
        input: "var(--color-input)", /* white with opacity */
        ring: "var(--color-ring)", /* deep-purple-a200 */
        background: "var(--color-background)", /* gray-950 */
        foreground: "var(--color-foreground)", /* white */
        primary: {
          DEFAULT: "var(--color-primary)", /* indigo-900 */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* deep-purple-a200 */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* red-500 */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* gray-900 */
          foreground: "var(--color-muted-foreground)", /* blue-gray-300 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* green-a400 */
          foreground: "var(--color-accent-foreground)", /* gray-950 */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* gray-900 */
          foreground: "var(--color-popover-foreground)", /* white */
        },
        card: {
          DEFAULT: "var(--color-card)", /* gray-900 */
          foreground: "var(--color-card-foreground)", /* white */
        },
        success: {
          DEFAULT: "var(--color-success)", /* green-500 */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* orange-500 */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* red-500 */
          foreground: "var(--color-error-foreground)", /* white */
        },
        navy: {
          deep: "var(--color-navy-deep)", /* indigo-950 */
        },
        violet: {
          vibrant: "var(--color-violet-vibrant)", /* violet-600 */
        },
        teal: {
          accent: "var(--color-teal-accent)", /* teal-400 */
        },
        midnight: "var(--color-midnight)", /* slate-900 */
        text: {
          primary: "var(--color-text-primary)", /* slate-200 */
          secondary: "var(--color-text-secondary)", /* slate-400 */
        },
        cta: {
          orange: "var(--color-cta-orange)", /* amber-500 */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ['Inter Display', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        cta: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "gradient-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.3s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.3s ease-out",
        "gradient-flow": "gradient-flow 8s ease infinite",
      },
      boxShadow: {
        'elevated': '0 4px 20px rgba(124, 77, 255, 0.15)',
        'prominent': '0 8px 40px rgba(26, 35, 126, 0.25)',
        'depth-layered': '0 4px 20px rgba(79, 70, 229, 0.15), 0 8px 40px rgba(79, 70, 229, 0.1), 0 16px 80px rgba(79, 70, 229, 0.05)',
      },
    },
  },
  plugins: [],
}