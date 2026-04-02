import React, { useState, useEffect } from 'react';
import { 
  Star, X, Plus, Filter, Download, Award, TrendingUp, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePerformance } from '../context/PerformanceContext';
import { useNotifications } from '../context/NotificationsContext';
import { useToast } from '../App';
import StarRating from './StarRating';
import * as XLSX from 'xlsx';
import Avatar from './Avatar';

const PerformanceManagement = () => {
  const { user, role } = useAuth();
  const performanceContext = usePerformance();
  const { reviews = [], isLoading = false, addReview, getEmployeeReviews, getLatestReview, getAverageRating, calculateOverallRating } = performanceContext || {};
  const { addNotification } = useNotifications();
  const { showToast } = useToast();

  const [employees, setEmployees] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [periodFilter, setPeriodFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    reviewPeriod: 'Q1 2025',
    ratings: {
      workQuality: 0,
      communication: 0,
      teamwork: 0,
      punctuality: 0,
      initiative: 0
    },
    comments: '',
    goals: ''
  });

  useEffect(() => {
    setMounted(true);
    loadEmployees();
  }, []);

  // ESC key to close drawer
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isDrawerOpen]);

  const loadEmployees = () => {
    const saved = localStorage.getItem('employees');
    if (saved) {
      setEmployees(JSON.parse(saved));
    } else {
      // Mock employees
      setEmployees([
        { id: 1, first_name: 'Admin', last_name: 'User', department_id: 1, email: 'admin@company.com' },
        { id: 2, first_name: 'John', last_name: 'Doe', department_id: 2, email: 'john@company.com' },
        { id: 3, first_name: 'Jane', last_name: 'Smith', department_id: 2, email: 'jane@company.com' }
      ]);
    }
  };

  const handleAddReview = (employee) => {
    setSelectedEmployee(employee);
    setReviewForm({
      reviewPeriod: 'Q1 2025',
      ratings: {
        workQuality: 0,
        communication: 0,
        teamwork: 0,
        punctuality: 0,
        initiative: 0
      },
      comments: '',
      goals: ''
    });
    setIsDrawerOpen(true);
  };

  const handleRatingChange = (category, value) => {
    setReviewForm(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: value
      }
    }));
  };

  const handleSubmitReview = () => {
    // Validation
    const hasAllRatings = Object.values(reviewForm.ratings).every(r => r > 0);
    if (!hasAllRatings) {
      showToast('Please provide ratings for all categories', 'error');
      return;
    }

    if (!reviewForm.comments.trim()) {
      showToast('Please provide comments', 'error');
      return;
    }

    const overallRating = calculateOverallRating(reviewForm.ratings);
    const review = {
      employeeId: selectedEmployee.id,
      employeeName: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
      reviewPeriod: reviewForm.reviewPeriod,
      ratings: reviewForm.ratings,
      overallRating: parseFloat(overallRating.toFixed(1)),
      comments: reviewForm.comments,
      goals: reviewForm.goals,
      reviewedBy: user?.name || 'Admin'
    };

    addReview(review);

    // Notify employee
    addNotification({
      userId: selectedEmployee.id,
      type: 'performance_review',
      message: `Your ${reviewForm.reviewPeriod} performance review has been completed`,
      link: '/performance'
    });

    showToast('Performance review submitted successfully', 'success');
    setIsDrawerOpen(false);
    setSelectedEmployee(null);
  };

  const handleExportToExcel = () => {
    showToast('Exporting...', 'info');

    const exportData = employees.map(emp => {
      const latestReview = getLatestReview(emp.id);
      return {
        'Employee Name': `${emp.first_name} ${emp.last_name}`,
        'Email': emp.email,
        'Latest Score': latestReview ? latestReview.overallRating : 'N/A',
        'Last Review Date': latestReview ? latestReview.reviewDate : 'N/A',
        'Review Period': latestReview ? latestReview.reviewPeriod : 'N/A',
        'Status': latestReview ? 'Reviewed' : 'Pending Review',
        'Work Quality': latestReview ? latestReview.ratings.workQuality : 'N/A',
        'Communication': latestReview ? latestReview.ratings.communication : 'N/A',
        'Teamwork': latestReview ? latestReview.ratings.teamwork : 'N/A',
        'Punctuality': latestReview ? latestReview.ratings.punctuality : 'N/A',
        'Initiative': latestReview ? latestReview.ratings.initiative : 'N/A'
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Performance Reviews');
    XLSX.writeFile(wb, `Performance_Reviews_${new Date().toISOString().split('T')[0]}.xlsx`);

    showToast('Export complete ✅', 'success');
  };

  const getRatingBadge = (rating) => {
    if (rating >= 4.5) return { label: 'Excellent', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
    if (rating >= 3.5) return { label: 'Good', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    if (rating >= 2.5) return { label: 'Average', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
    return { label: 'Needs Improvement', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const latestReview = getLatestReview(emp.id);
    
    if (departmentFilter !== 'All' && emp.department_id !== parseInt(departmentFilter)) return false;
    if (periodFilter !== 'All' && (!latestReview || latestReview.reviewPeriod !== periodFilter)) return false;
    if (ratingFilter !== 'All') {
      const rating = parseInt(ratingFilter);
      if (!latestReview || Math.floor(latestReview.overallRating) !== rating) return false;
    }
    
    return true;
  });

  const overallRating = calculateOverallRating(reviewForm.ratings);

  // Employee view
  if (role === 'employee') {
    const employeeId = user?.id || 2;
    
    // Defensive checks for all functions
    if (!getEmployeeReviews || !getAverageRating || !calculateOverallRating) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-[var(--text-secondary)]">Loading performance data...</p>
          </div>
        </div>
      );
    }
    
    const employeeReviews = getEmployeeReviews(employeeId) || [];
    const avgRating = getAverageRating(employeeId) || 0;
    const latestReview = employeeReviews.length > 0 ? employeeReviews[0] : null;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-[var(--border-color)] rounded-full" />
              <div className="absolute inset-0 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">My Performance</h1>
          <p className="text-[var(--text-secondary)]">View your performance reviews and ratings</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-purple-500 shadow-sm animate-fade-in-up opacity-0 stagger-1`} style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <Star size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{avgRating.toFixed(1)}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">across all reviews</p>
              </div>
            </div>
          </div>

          <div className={`bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-blue-500 shadow-sm animate-fade-in-up opacity-0 stagger-2`} style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Award size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{employeeReviews.length}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">completed</p>
              </div>
            </div>
          </div>

          <div className={`bg-white dark:bg-[var(--bg-card)] rounded-xl p-6 border-l-4 border-green-500 shadow-sm animate-fade-in-up opacity-0 stagger-3`} style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Latest Score</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{latestReview ? latestReview.overallRating.toFixed(1) : 'N/A'}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{latestReview ? latestReview.reviewPeriod : 'No reviews yet'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance History */}
        <div className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 animate-fade-in-up opacity-0 stagger-4`} style={{ animationFillMode: 'forwards' }}>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Performance History</h2>
          
          {employeeReviews.length === 0 ? (
            <div className="text-center py-12">
              <Award size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-[var(--text-secondary)]">No performance reviews yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {employeeReviews.map((review, index) => {
                const badge = getRatingBadge(review.overallRating);
                return (
                  <div key={review.id} className={`p-6 bg-[var(--input-bg)] rounded-xl border border-[var(--border-color)] animate-fade-in-up opacity-0`} style={{ animationDelay: `${0.1 * (index + 5)}s`, animationFillMode: 'forwards' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{review.reviewPeriod}</h3>
                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(review.reviewDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Star size={20} fill="#F59E0B" stroke="#F59E0B" />
                          <span className="text-2xl font-bold text-[var(--text-primary)]">{review.overallRating.toFixed(1)}</span>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badge.class}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    {/* Rating Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {Object.entries(review.ratings).map(([category, rating]) => (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-[var(--text-primary)] capitalize">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">{rating}/5</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(rating / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Comments */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2">Manager Comments</h4>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{review.comments}</p>
                    </div>

                    {/* Goals */}
                    {review.goals && (
                      <div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2">Goals for Next Period</h4>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{review.goals}</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                      <p className="text-xs text-[var(--text-secondary)]">Reviewed by {review.reviewedBy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin view
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Performance Management</h1>
          <p className="text-[var(--text-secondary)]">Manage employee performance reviews and ratings</p>
        </div>
        <button
          onClick={handleExportToExcel}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
        >
          <Download size={18} />
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            >
              <option value="All">All Departments</option>
              <option value="1">Executive Management</option>
              <option value="2">Engineering</option>
              <option value="3">HR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Review Period</label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            >
              <option value="All">All Periods</option>
              <option value="Q1 2025">Q1 2025</option>
              <option value="Q2 2025">Q2 2025</option>
              <option value="Q3 2025">Q3 2025</option>
              <option value="Q4 2025">Q4 2025</option>
              <option value="Annual 2025">Annual 2025</option>
              <option value="Q4 2024">Q4 2024</option>
              <option value="Q3 2024">Q3 2024</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--input-bg)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Latest Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Last Review Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredEmployees.map((emp) => {
                const latestReview = getLatestReview(emp.id);
                const badge = latestReview ? getRatingBadge(latestReview.overallRating) : null;
                
                return (
                  <tr key={emp.id} className="hover:bg-[var(--input-bg)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          initials={`${emp.first_name?.[0] || 'U'}${emp.last_name?.[0] || 'U'}`}
                          size="md"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {emp.first_name || 'Unknown'} {emp.last_name || 'User'}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">{emp.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {latestReview ? (
                        <div className="flex items-center gap-2">
                          <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
                          <span className="text-sm font-bold text-[var(--text-primary)]">
                            {latestReview.overallRating.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-[var(--text-secondary)]">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[var(--text-primary)]">
                        {latestReview ? new Date(latestReview.reviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {latestReview ? (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badge.class}`}>
                          Reviewed
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleAddReview(emp)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] hover:opacity-90 rounded-lg transition-all"
                      >
                        <Plus size={14} />
                        Add Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="review-drawer-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} aria-label="Close drawer" />
          
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-[var(--bg-card)] shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] p-6 flex items-center justify-between z-10">
              <div>
                <h2 id="review-drawer-title" className="text-xl font-bold text-white">Add Performance Review</h2>
                <p className="text-sm text-white/70 mt-1">
                  {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close drawer"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Review Period */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Review Period <span className="text-red-500">*</span>
                </label>
                <select
                  value={reviewForm.reviewPeriod}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewPeriod: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                >
                  <option value="Q1 2025">Q1 2025</option>
                  <option value="Q2 2025">Q2 2025</option>
                  <option value="Q3 2025">Q3 2025</option>
                  <option value="Q4 2025">Q4 2025</option>
                  <option value="Annual 2025">Annual 2025</option>
                </select>
              </div>

              {/* Rating Categories */}
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Rating Categories</h3>
                <div className="space-y-4">
                  {[
                    { key: 'workQuality', label: 'Work Quality' },
                    { key: 'communication', label: 'Communication' },
                    { key: 'teamwork', label: 'Teamwork' },
                    { key: 'punctuality', label: 'Punctuality' },
                    { key: 'initiative', label: 'Initiative' }
                  ].map(({ key, label }) => (
                    <div key={key} className="p-4 bg-[var(--input-bg)] rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{label}</span>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {reviewForm.ratings[key] > 0 ? `${reviewForm.ratings[key]}/5` : 'Not rated'}
                        </span>
                      </div>
                      <StarRating
                        value={reviewForm.ratings[key]}
                        onChange={(value) => handleRatingChange(key, value)}
                        size={24}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall Rating */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Overall Rating</span>
                  <div className="flex items-center gap-2">
                    <Star size={20} fill="#F59E0B" stroke="#F59E0B" />
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {overallRating > 0 ? overallRating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewForm.comments}
                  onChange={(e) => setReviewForm({ ...reviewForm, comments: e.target.value })}
                  placeholder="Provide detailed feedback on the employee's performance..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
                />
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Goals for Next Period
                </label>
                <textarea
                  value={reviewForm.goals}
                  onChange={(e) => setReviewForm({ ...reviewForm, goals: e.target.value })}
                  placeholder="Set goals and expectations for the next review period..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-[var(--border-color)] text-[var(--text-secondary)] font-bold rounded-xl hover:bg-[var(--input-bg)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1E1B4B] to-[#3D3B8E] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PerformanceManagement;
