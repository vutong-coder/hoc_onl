import React from 'react';
import { Challenge } from '../../types/contestDetail';
import styles from '../../assets/css/ChallengeCard.module.css';

interface ChallengeCardProps {
  challenge: Challenge;
  onSolveClick: (challenge: Challenge) => void;
  onDiscussionClick?: (challenge: Challenge) => void;
  onLeaderboardClick?: (challenge: Challenge) => void;
  onSubmissionsClick?: (challenge: Challenge) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onSolveClick,
  onDiscussionClick,
  onLeaderboardClick,
  onSubmissionsClick
}) => {
  const handleSolveClick = () => {
    onSolveClick(challenge);
  };

  const handleDiscussionClick = () => {
    if (onDiscussionClick) {
      onDiscussionClick(challenge);
    }
  };

  const handleLeaderboardClick = () => {
    if (onLeaderboardClick) {
      onLeaderboardClick(challenge);
    }
  };

  const handleSubmissionsClick = () => {
    if (onSubmissionsClick) {
      onSubmissionsClick(challenge);
    }
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'Easy': return styles.difficultyEasy;
      case 'Medium': return styles.difficultyMedium;
      case 'Hard': return styles.difficultyHard;
      default: return styles.difficultyEasy;
    }
  };

  const getStatusIcon = (status: Challenge['status']) => {
    switch (status) {
      case 'solved': return '✅';
      case 'attempted': return '🔄';
      case 'not_attempted': return '⭕';
      default: return '⭕';
    }
  };

  return (
    <div className={styles.challengeCard}>
      <div className={styles.challengeHeader}>
        <div className={styles.challengeInfo}>
          <h3 className={styles.challengeTitle}>
            {getStatusIcon(challenge.status)} {challenge.title}
          </h3>
          <div className={styles.challengeStats}>
            <span className={styles.stat}>
              Success Rate: <strong>{challenge.successRate.toFixed(2)}%</strong>
            </span>
            <span className={styles.stat}>
              Max Score: <strong>{challenge.maxScore}</strong>
            </span>
            <span className={`${styles.stat} ${styles.difficulty} ${getDifficultyColor(challenge.difficulty)}`}>
              Difficulty: <strong>{challenge.difficulty}</strong>
            </span>
          </div>
        </div>
        
        <div className={styles.challengeActions}>
          <div className={styles.actionIcons}>
            <button
              className={styles.actionIcon}
              onClick={handleDiscussionClick}
              title="Discussion"
              type="button"
            >
              💬
            </button>
            <button
              className={styles.actionIcon}
              onClick={handleLeaderboardClick}
              title="Leaderboard"
              type="button"
            >
              🏆
            </button>
            <button
              className={styles.actionIcon}
              onClick={handleSubmissionsClick}
              title="Submissions"
              type="button"
            >
              📋
            </button>
          </div>
          
          <button
            className={styles.solveButton}
            onClick={handleSolveClick}
            type="button"
          >
            Solve Challenge
          </button>
        </div>
      </div>
      
      {challenge.description && (
        <div className={styles.challengeDescription}>
          <p>{challenge.description}</p>
        </div>
      )}
      
      {challenge.tags && challenge.tags.length > 0 && (
        <div className={styles.challengeTags}>
          {challenge.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;
