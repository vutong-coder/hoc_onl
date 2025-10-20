import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchExams } from '../features/exams/examSlice';
import { fetchCourses } from '../features/courses/courseSlice';
import { fetchAnalytics } from '../features/analytics/analyticsSlice';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import StatsSection from '../components/sections/StatsSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import CTASection from '../components/sections/CTASection';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';

const LandingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics } = useSelector((state: RootState) => state.analytics);
  const { exams } = useSelector((state: RootState) => state.exams);
  const { courses } = useSelector((state: RootState) => state.courses);

  React.useEffect(() => {
    // Fetch initial data for landing page
    dispatch(fetchExams());
    dispatch(fetchCourses());
    dispatch(fetchAnalytics());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection 
          stats={{
            totalUsers: analytics?.totalUsers || 0,
            totalExams: analytics?.totalExams || 0,
            totalCourses: analytics?.totalCourses || 0,
            totalOrganizations: analytics?.totalOrganizations || 0,
          }}
        />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
