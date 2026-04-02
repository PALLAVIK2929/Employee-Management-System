# Leave Management System - User Guide

## Overview
The Leave Management System provides a complete leave application and approval workflow for both employees and administrators.

## Features Implemented

### 1. Leave Application Form (Employee - `/leaves/apply`)
- **Leave Types**: Annual, Sick, Casual, Maternity/Paternity, Unpaid
- **Date Selection**: From Date and To Date pickers
- **Auto-calculation**: Automatically calculates number of days
- **Validation**:
  - From date cannot be in the past
  - To date cannot be before From date
  - Reason is required (minimum 10 characters)
  - Cannot apply if leave balance is 0
- **Success Toast**: Shows confirmation message on submission
- **Animations**: Staggered fade-up animations on form fields

### 2. My Leaves Page (Employee - `/my-leaves`)
- **Leave Balance Summary**:
  - Leave Balance: Shows available days
  - Used: Shows days taken
  - Pending Requests: Shows count of pending requests
- **Leave Requests Table**:
  - Columns: Leave Type, From, To, Days, Reason, Status, Applied On
  - Status Badges: Pending (amber), Approved (green), Rejected (red)
  - Cancel pending requests functionality
- **Apply for Leave Button**: Quick navigation to application form

### 3. Leave Management Page (Admin - `/leaves`)
- **Statistics Dashboard**:
  - Pending Requests count
  - Approved count
  - Rejected count
- **Filters**:
  - Search by employee name
  - Filter by status (All/Pending/Approved/Rejected)
  - Filter by leave type
- **Leave Requests Table**:
  - Shows all employee leave requests
  - Columns: Employee Name, Leave Type, From, To, Days, Reason, Status, Actions
  - Approve/Reject buttons for pending requests
  - Rejection modal with reason input
- **Toast Notifications**: Shows success messages for approve/reject actions

### 4. Notifications System
- **Bell Icon**: Shows unread notification count
- **Notification Dropdown**: Displays leave status updates
- **Auto-notification**: When admin approves/rejects, employee receives notification
- **Notification Details**: Shows approval/rejection with dates and reason (if rejected)

### 5. Leave Balance Logic
- Each employee starts with:
  - 12 Annual leave days
  - 10 Sick leave days
  - 8 Casual leave days
  - 90 Maternity/Paternity days
  - Unlimited Unpaid leave
- **Balance Updates**:
  - When leave is approved: Days deducted from balance
  - When leave is cancelled/rejected: Days restored
  - Balance shown in Employee Dashboard hero section

### 6. Mock Leave Data
Pre-populated with sample leave requests:
- John Doe: 3 leave requests (pending, approved, rejected)
- Jane Smith: 1 maternity leave request (pending)

### 7. Design
- **Dark Mode Support**: All components support light/dark themes
- **Status Badges**:
  - Pending: Amber background with amber text
  - Approved: Green background with green text
  - Rejected: Red background with red text
- **Action Buttons**: Small icon+text style with hover effects
- **Rejection Modal**: Centered overlay with textarea for reason
- **Tables**: Hover highlights, responsive design
- **Animations**: Smooth transitions and fade-in effects

## Routes

### Employee Routes
- `/leaves/apply` - Apply for new leave
- `/my-leaves` - View personal leave requests
- `/leaves` - Redirects to My Leaves for employees

### Admin Routes
- `/leaves` - Manage all employee leave requests

## Data Storage
- All leave data stored in `localStorage` under keys:
  - `leaves` - All leave requests
  - `leaveBalances` - Employee leave balances
  - `leaveNotifications` - Leave status notifications

## Context API
- **LeaveContext**: Manages leave state globally
  - `applyLeave()` - Submit new leave request
  - `approveLeave()` - Approve a leave request
  - `rejectLeave()` - Reject with reason
  - `cancelLeave()` - Cancel pending request
  - `getEmployeeBalance()` - Get employee's leave balance
  - `getEmployeeNotifications()` - Get notifications for employee
  - `getUnreadCount()` - Get unread notification count

## Components

### LeaveApplicationForm
Modal form for applying leave with validation and animations.

### MyLeaves
Employee view showing personal leave balance and requests.

### LeaveManagement
Admin view for managing all employee leave requests with filters.

### Header (Updated)
Integrated notification bell showing leave status updates.

### Home (Updated)
Shows dynamic leave balance in employee dashboard.

## Usage

### For Employees:
1. Navigate to "Leaves" in sidebar or click "Apply for Leave"
2. Fill in leave details (type, dates, reason)
3. Submit request
4. View status in "My Leaves" page
5. Check notification bell for approval/rejection updates
6. Cancel pending requests if needed

### For Admins:
1. Navigate to "Leaves" in sidebar
2. View all employee leave requests
3. Use filters to find specific requests
4. Click "Approve" for valid requests
5. Click "Reject" and provide reason for invalid requests
6. View statistics dashboard for overview

## Future Enhancements
- Email notifications
- Leave calendar view
- Leave policy configuration
- Bulk approve/reject
- Leave reports and analytics
- Leave carry-forward rules
- Public holiday integration
