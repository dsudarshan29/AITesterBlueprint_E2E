/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F19', // very dark navy
        foreground: '#E2E8F0', // slate-200
        card: '#111827', // slightly lighter navy (gray-900)
        'card-foreground': '#F3F4F6', // gray-100
        primary: '#6366F1', // indigo-500
        'primary-foreground': '#FFFFFF',
        secondary: '#1F2937', // gray-800
        'secondary-foreground': '#F3F4F6',
        muted: '#1F2937',
        'muted-foreground': '#9CA3AF',
        accent: '#1E40AF', // blue-800
        'accent-foreground': '#FFFFFF',
        border: '#1F2937',
        input: '#1F2937',
        ring: '#6366F1',
        
        // Custom status colors based on mockup
        'status-wishlist': '#A855F7', // purple
        'status-applied': '#3B82F6', // blue
        'status-followup': '#EAB308', // yellow
        'status-interview': '#10B981', // emerald
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      boxShadow: {
        'glow-wishlist': '0 -2px 15px -3px rgba(168, 85, 247, 0.3)',
        'glow-applied': '0 -2px 15px -3px rgba(59, 130, 246, 0.3)',
        'glow-followup': '0 -2px 15px -3px rgba(234, 179, 8, 0.3)',
        'glow-interview': '0 -2px 15px -3px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
