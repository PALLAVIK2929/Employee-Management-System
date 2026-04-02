# EMS Installation & Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Required Packages

The following packages are required and should be installed:

```bash
npm install xlsx jspdf jspdf-autotable recharts
```

These packages are used for:
- `xlsx` - Excel export functionality (Attendance, Performance reports)
- `jspdf` - PDF export functionality (Employee attendance reports)
- `jspdf-autotable` - Table formatting in PDFs
- `recharts` - Charts in attendance tracking

### 3. Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

Note: The Anthropic API key is only needed for the AI Handbook Chat feature. The rest of the application works without it.

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### 6. Preview Production Build

```bash
npm run preview
```

## Demo Credentials

### Admin Account
- Email: `admin@ems.com`
- Password: `admin123`

### Employee Account
- Email: `employee@ems.com`
- Password: `emp123`

## Features Available

### Admin Features
- Employee Management (CRUD operations)
- Department Management
- Leave Approval/Rejection
- Performance Reviews
- Attendance Tracking (monthly calendar)
- Analytics Dashboard
- Bulk Upload
- Onboarding Flow
- Platform Tools

### Employee Features
- View Personal Dashboard
- Apply for Leave
- View Leave History
- View Performance Reviews
- View Personal Attendance
- View Payroll Information
- Task Management
- AI Handbook Chat

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Routing**: React Router v6
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Export**: xlsx, jspdf
- **AI**: Anthropic Claude API (optional)

## Project Structure

```
frontend/
├── public/
│   ├── favicon.svg
│   ├── logo.svg
│   └── demo.mp4
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── EmployeesPage.jsx
│   │   ├── LeaveManagement.jsx
│   │   ├── PerformanceManagement.jsx
│   │   ├── AttendanceTracking.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── NotFound.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── EmptyState.jsx
│   │   └── ... (other components)
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── LeaveContext.jsx
│   │   ├── NotificationsContext.jsx
│   │   ├── PerformanceContext.jsx
│   │   └── AttendanceContext.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── api.js
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Data Storage

The application uses `localStorage` for data persistence. All data is stored in the browser:

- Employees
- Departments
- Leave requests
- Performance reviews
- Attendance records
- Notifications

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Dark Mode

The application supports dark mode with automatic theme detection and manual toggle. Theme preference is saved to localStorage.

## Troubleshooting

### Issue: Dependencies not installing
**Solution**: Clear npm cache and try again
```bash
npm cache clean --force
npm install
```

### Issue: Port 5173 already in use
**Solution**: Kill the process or use a different port
```bash
npm run dev -- --port 3000
```

### Issue: Build fails
**Solution**: Check Node.js version (should be v16+)
```bash
node --version
```

### Issue: Charts not displaying
**Solution**: Ensure recharts is installed
```bash
npm install recharts
```

### Issue: Export features not working
**Solution**: Ensure xlsx and jspdf are installed
```bash
npm install xlsx jspdf jspdf-autotable
```

## Performance Tips

1. **Lazy Loading**: All routes are lazy loaded for optimal performance
2. **Memoization**: Context functions use useCallback for optimization
3. **Code Splitting**: Automatic code splitting with Vite
4. **Asset Optimization**: Images and assets are optimized during build

## Security Notes

- All passwords are stored in plain text in localStorage (demo purposes only)
- In production, implement proper authentication with backend API
- Use HTTPS in production
- Implement CSRF protection
- Add rate limiting for API calls

## Next Steps for Production

1. Set up a backend API (Node.js/Express, Python/FastAPI, etc.)
2. Implement proper authentication (JWT, OAuth)
3. Use a real database (PostgreSQL, MongoDB, etc.)
4. Add server-side validation
5. Implement file upload to cloud storage
6. Set up CI/CD pipeline
7. Add monitoring and logging
8. Implement proper error tracking (Sentry, etc.)

## Support

For issues or questions, please refer to:
- README.md for feature documentation
- FEATURES_COMPLETED.md for implementation details
- POLISH_COMPLETED.md for polish improvements

## License

MIT License - See LICENSE file for details
