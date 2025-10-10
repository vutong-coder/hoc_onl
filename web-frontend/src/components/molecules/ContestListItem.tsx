import React from 'react';
import { Contest } from '../../types/contest';
import styles from '../../assets/css/ContestListItem.module.css';

interface ContestListItemProps {
  contest: Contest;
  onActionClick?: (contest: Contest) => void;
}

const ContestListItem: React.FC<ContestListItemProps> = ({
  contest,
  onActionClick
}) => {
  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick(contest);
    } else {
      // Default action - in a real app, this would navigate
      console.log(`Action clicked for contest: ${contest.id}`);
    }
  };

  const getStatusColor = (status: Contest['status']) => {
    switch (status) {
      case 'active':
        return '#10b981'; // Green
      case 'upcoming':
        return '#f59e0b'; // Orange
      case 'archived':
        return '#6b7280'; // Gray
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: Contest['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'upcoming':
        return 'Upcoming';
      case 'archived':
        return 'Ended';
      default:
        return status;
    }
  };

  return (
    <div className={styles.contestListItem}>
      <div className={styles.contestInfo}>
        <div className={styles.header}>
          <h3 className={styles.title}>{contest.title}</h3>
          <span 
            className={styles.statusBadge}
            style={{ 
              backgroundColor: getStatusColor(contest.status) + '20',
              color: getStatusColor(contest.status)
            }}
          >
            {getStatusText(contest.status)}
          </span>
        </div>
        <p className={styles.description}>{contest.description}</p>
        {contest.region && (
          <div className={styles.meta}>
            <span className={styles.region}>📍 {contest.region}</span>
          </div>
        )}
      </div>
      
      <div className={styles.actionContainer}>
        <button
          className={styles.actionButton}
          onClick={handleActionClick}
          type="button"
        >
          {contest.actionButtonText}
        </button>
      </div>
    </div>
  );
};

export default ContestListItem;
