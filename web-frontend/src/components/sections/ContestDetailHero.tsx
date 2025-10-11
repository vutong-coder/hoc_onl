import React from 'react';
import { ContestDetail } from '../../types/contestDetail';
import styles from '../../assets/css/ContestDetailHero.module.css';

interface ContestDetailHeroProps {
  contest: ContestDetail;
  onDetailsClick?: () => void;
}

const ContestDetailHero: React.FC<ContestDetailHeroProps> = ({
  contest,
  onDetailsClick
}) => {
  const handleDetailsClick = () => {
    if (onDetailsClick) {
      onDetailsClick();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: ContestDetail['status']) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'upcoming': return styles.statusUpcoming;
      case 'archived': return styles.statusArchived;
      default: return styles.statusDefault;
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs}>
          <a href="/user/compete" className={styles.breadcrumbLink}>
            All Contests
          </a>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>{contest.title}</span>
        </nav>

        {/* Contest Title and Details */}
        <div className={styles.titleSection}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>{contest.title}</h1>
            <div className={styles.contestMeta}>
              <span className={`${styles.status} ${getStatusColor(contest.status)}`}>
                {contest.status.toUpperCase()}
              </span>
              {contest.description && (
                <p className={styles.description}>{contest.description}</p>
              )}
              <div className={styles.dateInfo}>
                <span className={styles.dateLabel}>Start Date:</span>
                <span className={styles.dateValue}>{formatDate(contest.startDate)}</span>
                <span className={styles.dateLabel}>End Date:</span>
                <span className={styles.dateValue}>{formatDate(contest.endDate)}</span>
              </div>
            </div>
          </div>
          
          <button
            className={styles.detailsButton}
            onClick={handleDetailsClick}
            type="button"
          >
            Details →
          </button>
        </div>

        {/* Challenges Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Challenges</h2>
          <div className={styles.challengesCount}>
            {contest.challenges.length} challenge{contest.challenges.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailHero;
