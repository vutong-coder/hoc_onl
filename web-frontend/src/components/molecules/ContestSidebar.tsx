import React, { useState } from 'react';
import { ContestDetail } from '../../types/contestDetail';
import styles from '../../assets/css/ContestSidebar.module.css';

interface ContestSidebarProps {
  contest: ContestDetail;
  onLeaderboardClick?: () => void;
  onCompareProgressClick?: () => void;
  onReviewSubmissionsClick?: () => void;
  onMessageSend?: (message: string) => void;
}

const ContestSidebar: React.FC<ContestSidebarProps> = ({
  contest,
  onLeaderboardClick,
  onCompareProgressClick,
  onReviewSubmissionsClick,
  onMessageSend
}) => {
  const [message, setMessage] = useState('');

  const handleLeaderboardClick = () => {
    if (onLeaderboardClick) {
      onLeaderboardClick();
    }
  };

  const handleCompareProgressClick = () => {
    if (onCompareProgressClick) {
      onCompareProgressClick();
    }
  };

  const handleReviewSubmissionsClick = () => {
    if (onReviewSubmissionsClick) {
      onReviewSubmissionsClick();
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onMessageSend) {
      onMessageSend(message.trim());
      setMessage('');
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className={styles.sidebar}>
      {/* Social Media Icons */}
      <div className={styles.socialIcons}>
        <a href="#" className={styles.socialIcon} title="Share on Facebook">
          f
        </a>
        <a href="#" className={styles.socialIcon} title="Share on Twitter">
          🐦
        </a>
        <a href="#" className={styles.socialIcon} title="Share on LinkedIn">
          in
        </a>
      </div>

      {/* Current Rank */}
      <div className={styles.rankSection}>
        <h3 className={styles.rankTitle}>Current Rank:</h3>
        <p className={styles.rankValue}>
          {contest.currentRank ? `#${contest.currentRank}` : 'N/A'}
        </p>
        {contest.totalParticipants && (
          <p className={styles.totalParticipants}>
            of {contest.totalParticipants.toLocaleString()} participants
          </p>
        )}
      </div>

      {/* Rating Update Message */}
      {contest.ratingUpdateMessage && (
        <div className={styles.ratingMessage}>
          <p className={styles.ratingText}>{contest.ratingUpdateMessage}</p>
        </div>
      )}

      {/* Action Links */}
      <div className={styles.actionLinks}>
        <button
          className={styles.actionLink}
          onClick={handleLeaderboardClick}
          type="button"
        >
          <span className={styles.actionIcon}>🏆</span>
          Current Leaderboard
        </button>
        
        <button
          className={styles.actionLink}
          onClick={handleCompareProgressClick}
          type="button"
        >
          <span className={styles.actionIcon}>📊</span>
          Compare Progress
        </button>
        
        <button
          className={styles.actionLink}
          onClick={handleReviewSubmissionsClick}
          type="button"
        >
          <span className={styles.actionIcon}>📋</span>
          Review Submissions
        </button>
      </div>

      {/* Message Center */}
      <div className={styles.messageCenter}>
        <h4 className={styles.messageTitle}>Message Center</h4>
        <form onSubmit={handleMessageSubmit} className={styles.messageForm}>
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message..."
            className={styles.messageInput}
          />
          <button
            type="submit"
            className={styles.messageButton}
            disabled={!message.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContestSidebar;
