import React from 'react';
import { Contest, ContestSection as ContestSectionType } from '../types/contest';
import { featuredContest, contestSections } from '../data/mockContests';
import FeaturedContest from '../components/sections/FeaturedContest';
import ContestSection from '../components/sections/ContestSection';
import Footer from '../components/layouts/Footer';
import styles from '../assets/css/CompetePage.module.css';

const CompetePage: React.FC = () => {
  const handleContestActionClick = (contest: Contest) => {
    // In a real app, this would handle navigation to contest details
    console.log(`Contest action clicked: ${contest.id}`);
    // Example: navigate to contest detail page or open registration modal
  };

  const handleViewAllClick = (section: ContestSectionType) => {
    // In a real app, this would navigate to the full list page
    console.log(`View all clicked for section: ${section.title}`);
    // Example: navigate to section's dedicated page
  };

  const handleFeaturedContestClick = (contest: any) => {
    // In a real app, this would handle featured contest registration
    console.log(`Featured contest clicked: ${contest.id}`);
    // Example: navigate to registration or contest details
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerTop}>
            <div className={styles.headerLeft}>
              <nav className={styles.breadcrumb}>
                <span className={styles.breadcrumbText}>All Contests</span>
              </nav>
              <h1 className={styles.pageTitle}>Contests</h1>
            </div>
            
            <div className={styles.pageActions}>
              <button className={styles.manageButton} type="button">
                Manage a Contest
              </button>
              <button className={styles.createButton} type="button">
                Create a Contest
              </button>
            </div>
          </div>
        </div>

        {/* Featured Contest */}
        <FeaturedContest
          contest={featuredContest}
          onActionClick={handleFeaturedContestClick}
        />

        {/* Contest Sections */}
        {contestSections.map((section) => (
          <ContestSection
            key={section.title}
            section={section}
            onContestActionClick={handleContestActionClick}
            onViewAllClick={handleViewAllClick}
          />
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CompetePage;
