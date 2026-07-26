module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'media',
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
      fontFamily: {
        soria:       ["Soria", "Bodoni Moda", "Playfair Display", "serif"],
        playfair:    ["Playfair Display", "serif"],
        grotesk:     ["Space Grotesk", "sans-serif"],
        inter:       ["Inter", "sans-serif"],
        sans:        ["Inter", "Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        gold: {
          DEFAULT: '#d97706',
          light:   '#fbbf24',
          dark:    '#92400e',
          faint:   'rgba(217,119,6,0.08)',
        },
        herb: {
          50:  '#f6faf3',
          100: '#edf5e7',
          500: '#4a7c3f',
          900: '#1a2f17',
        },
        cream: {
          DEFAULT: '#FDFBF7',
          dark:    '#F5F2EB',
          deeper:  '#EDE9DF',
        },
      },
      boxShadow: {
        'gold':    '0 8px 32px rgba(217,119,6,0.18)',
        'gold-lg': '0 16px 64px rgba(217,119,6,0.25)',
        'glass':   '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        'card':    '0 4px 24px rgba(0,0,0,0.05)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.10)',
        'inner-gold': 'inset 0 0 0 1px rgba(217,119,6,0.2)',
      },
      backgroundImage: {
        'gradient-gold':    'linear-gradient(135deg, #d97706, #b45309)',
        'gradient-gold-h':  'linear-gradient(90deg, #d97706, #fbbf24, #d97706)',
        'gradient-cream':   'linear-gradient(180deg, #FDFBF7, #F5F2EB)',
        'gradient-dark':    'linear-gradient(135deg, #14120B, #1C1A12)',
        'noise':            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float':           'float 4s ease-in-out infinite',
        'float-slow':      'float-slow 6s ease-in-out infinite',
        'blob':            'blob 8s ease-in-out infinite',
        'gradient-x':      'gradient-x 4s ease infinite',
        'shine':           'shine 1.5s ease-in-out',
        'marquee':         'marquee 40s linear infinite',
        'pulse-border':    'pulse-border 2s ease-in-out infinite',
        'slideDown':       'slideDown 0.5s cubic-bezier(0.16,1,0.3,1)',
        'fadeInUp':        'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer':         'shimmer 1.8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-18px)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%':     { transform: 'translateY(-10px) rotate(3deg)' },
        },
        blob: {
          '0%':  { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(30px,-50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px,20px) scale(0.9)' },
          '100%':{ transform: 'translate(0,0) scale(1)' },
        },
        'gradient-x': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        shine: {
          '0%':   { left: '-60%' },
          '100%': { left: '125%' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-border': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(217,119,6,0.3)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(217,119,6,0)' },
        },
        slideDown: {
          from: { transform: 'translateY(-100%)', opacity: '0' },
          to:   { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      borderRadius: {
        '2xl':  '16px',
        '3xl':  '24px',
        '4xl':  '32px',
      },
    },
  },
  plugins: [],
}
