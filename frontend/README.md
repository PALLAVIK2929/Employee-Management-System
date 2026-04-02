# EMS — Employee Management System

> A modern, AI-powered employee management system built with React and Vite. Streamline HR operations with intelligent automation and beautiful UI.

![EMS Dashboard](./screenshot.png)

## ✨ Features

### Core HR Management
- **Employee Directory** - Comprehensive employee database with search, filter, and bulk operations
- **Department Management** - Organize teams and hierarchies
- **Leave Management** - Complete leave application and approval workflow
- **Performance Reviews** - 360-degree performance tracking with star ratings
- **Attendance Tracking** - Calendar-based attendance with automated reports
- **Payroll System** - Salary management and payslip generation

### Advanced Features
- **AI Handbook Assistant** - Chat with company policies using generative AI
- **Onboarding Automation** - AI-generated onboarding plans
- **Real-time Notifications** - Stay updated with instant alerts
- **Analytics Dashboard** - Workforce insights and visualizations
- **Bulk Upload** - Import employees via CSV/Excel
- **Profile Management** - Detailed employee profiles with edit capabilities

### User Experience
- **Dark Mode** - Beautiful dark theme support
- **Responsive Design** - Works seamlessly on all devices
- **Role-Based Access** - Admin and Employee views
- **Export Capabilities** - PDF and Excel exports
- **Offline Support** - LocalStorage persistence

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **jsPDF** - PDF generation
- **XLSX** - Excel file handling

### Backend Integration
- **FastAPI** - Python backend (optional)
- **Anthropic Claude** - AI assistant
- **MCP (Model Context Protocol)** - Tool integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- (Optional) Python 3.9+ for backend

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ems.git
cd ems/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the frontend directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 👤 Demo Credentials

### Admin Account
- **Email:** admin@ems.com
- **Password:** admin123

### Employee Account
- **Email:** employee@ems.com
- **Password:** emp123

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── AttendanceTracking.jsx
│   │   ├── PerformanceManagement.jsx
│   │   ├── LeaveManagement.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── EmptyState.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── ...
│   ├── context/         # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── LeaveContext.jsx
│   │   ├── NotificationsContext.jsx
│   │   ├── PerformanceContext.jsx
│   │   └── AttendanceContext.jsx
│   ├── api.js          # API client
│   ├── App.jsx         # Main app component
│   ├── App.css         # Global styles
│   └── main.jsx        # Entry point
├── .env.local          # Environment variables
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── tailwind.config.js  # Tailwind configuration
```

## 🎨 Design System

### Colors
- **Primary:** `#1E1B4B` (Dark Navy)
- **Accent:** `#3D3B8E` (Purple)
- **Success:** `#10B981` (Green)
- **Warning:** `#F59E0B` (Amber)
- **Error:** `#EF4444` (Red)

### Typography
- **Font Family:** Inter, system-ui
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 22px, 28px

### Spacing Scale
- 4px, 8px, 12px, 16px, 24px, 32px, 48px

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 20px

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing
- XSS protection
- CSRF protection

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- ARIA labels and roles
- Focus management
- Color contrast ratios

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern SaaS applications
- Built with ❤️ using React and Vite

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for modern HR teams**
