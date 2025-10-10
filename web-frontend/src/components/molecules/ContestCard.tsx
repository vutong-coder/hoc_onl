import React from 'react';
import { Contest } from '../../types/contest';
import styles from '../../assets/css/ContestCard.module.css';

interface ContestCardProps {
  contest: Contest;
  onActionClick?: (contest: Contest) => void;
}

const ContestCard: React.FC<ContestCardProps> = ({
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

  const getTypeColor = (type: Contest['type']) => {
    switch (type) {
      case 'global':
        return '#3b82f6'; // Blue
      case 'college':
        return '#8b5cf6'; // Purple
      case 'hiring':
        return '#10b981'; // Green
      case 'practice':
        return '#f59e0b'; // Orange
      default:
        return '#6b7280'; // Gray
    }
  };

  const getTypeText = (type: Contest['type']) => {
    switch (type) {
      case 'global':
        return 'Global';
      case 'college':
        return 'College';
      case 'hiring':
        return 'Hiring';
      case 'practice':
        return 'Practice';
      default:
        return type;
    }
  };

  return (
    <div className={styles.contestCard}>
      <div className={styles.cardHeader}>
        <div className={styles.typeBadge} style={{ color: getTypeColor(contest.type) }}>
          {getTypeText(contest.type)}
        </div>
        {contest.difficulty && (
          <div className={styles.difficultyBadge}>
            {contest.difficulty}
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{contest.title}</h3>
        <p className={styles.description}>{contest.description}</p>
        
        {contest.tags && contest.tags.length > 0 && (
          <div className={styles.tags}>
            {contest.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
            {contest.tags.length > 3 && (
              <span className={styles.tag}>+{contest.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.cardFooter}>
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

export default ContestCard;
