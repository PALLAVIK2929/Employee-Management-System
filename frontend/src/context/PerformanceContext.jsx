import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PerformanceContext = createContext();

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

// Mock initial reviews for John Doe
const INITIAL_REVIEWS = [
  {
    id: 1,
    employeeId: 2,
    employeeName: 'John Doe',
    reviewPeriod: 'Q4 2024',
    reviewDate: '2024-12-15',
    ratings: {
      workQuality: 4,
      communication: 5,
      teamwork: 4,
      punctuality: 5,
      initiative: 4
    },
    overallRating: 4.4,
    comments: 'John has shown excellent performance this quarter. His communication skills are outstanding and he consistently delivers high-quality work. Keep up the great work!',
    goals: 'Focus on taking more leadership initiatives in team projects. Consider mentoring junior developers.',
    reviewedBy: 'Sarah Wilson'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'John Doe',
    reviewPeriod: 'Q3 2024',
    reviewDate: '2024-09-20',
    ratings: {
      workQuality: 4,
      communication: 4,
      teamwork: 4,
      punctuality: 5,
      initiative: 3
    },
    overallRating: 4.0,
    comments: 'Solid performance throughout the quarter. John is reliable and produces quality work consistently. Would like to see more proactive initiative in suggesting improvements.',
    goals: 'Work on proposing new ideas and improvements to existing processes. Increase participation in team discussions.',
    reviewedBy: 'Sarah Wilson'
  }
];

export const PerformanceProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reviews from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('performanceReviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse performance reviews', e);
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
    }
    setIsLoading(false);
  }, []);

  // Save reviews to localStorage
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem('performanceReviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  const addReview = useCallback((review) => {
    const newReview = {
      ...review,
      id: Date.now(),
      reviewDate: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newReview, ...prev]);
    return newReview;
  }, []);

  const getEmployeeReviews = useCallback((employeeId) => {
    return reviews.filter(r => r.employeeId === employeeId);
  }, [reviews]);

  const getLatestReview = useCallback((employeeId) => {
    const employeeReviews = reviews.filter(r => r.employeeId === employeeId);
    return employeeReviews.length > 0 ? employeeReviews[0] : null;
  }, [reviews]);

  const getAverageRating = useCallback((employeeId) => {
    const employeeReviews = reviews.filter(r => r.employeeId === employeeId);
    if (employeeReviews.length === 0) return 0;
    
    const sum = employeeReviews.reduce((acc, review) => acc + review.overallRating, 0);
    return sum / employeeReviews.length;
  }, [reviews]);

  const calculateOverallRating = useCallback((ratings) => {
    const values = Object.values(ratings);
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }, []);

  return (
    <PerformanceContext.Provider value={{
      reviews,
      isLoading,
      addReview,
      getEmployeeReviews,
      getLatestReview,
      getAverageRating,
      calculateOverallRating
    }}>
      {children}
    </PerformanceContext.Provider>
  );
};
