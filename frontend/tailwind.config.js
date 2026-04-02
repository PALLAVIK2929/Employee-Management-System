export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E1B4B', // Dark navy/indigo
        accent: '#3D3B8E',  // Purple accent
        'accent-light': '#EEEAFD', // Light purple hover
        'page-bg': '#F4F4F8', // Light gray page bg
        muted: '#6B6B80', // Muted text
        'header-bg': '#F8F8FD', // Table header row
        'status-active': '#F2FDF6',
        'status-pending': '#FEFDF0',
        'status-leave': '#F0F6FF',
        'status-terminated': '#FFF5F5',
        'badge-active': '#10B981',
        'badge-pending': '#F59E0B',
        'badge-leave': '#3B82F6',
        'badge-terminated': '#EF4444',
      },
      spacing: {
        'sidebar': '240px',
      }
    },
  },
  plugins: [],
}
