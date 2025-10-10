import React from 'react';
import { CertificationDetail } from '../../types/certificationDetail';
import styles from '../../assets/css/CertificationDetailHero.module.css';

interface CertificationDetailHeroProps {
  certification: CertificationDetail;
  onGetCertified: () => void;
}

const CertificationDetailHero: React.FC<CertificationDetailHeroProps> = ({
  certification,
  onGetCertified
}) => {

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Basic':
        return '#10b981';
      case 'Intermediate':
        return '#f59e0b';
      case 'Advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>
              Get certified as a
              <br />
              <span className={styles.certificationTitle}>
                {certification.title}
              </span>
              <br />
              <span className={styles.subtitle}>
                {certification.subtitle}
              </span>
            </h1>
            
            <p className={styles.description}>
              {certification.description}
            </p>
            
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statIcon}>⏱️</span>
                <span className={styles.statText}>{certification.duration}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statIcon}>❓</span>
                <span className={styles.statText}>{certification.questions}</span>
              </div>
              <div className={styles.stat}>
                <span 
                  className={styles.levelBadge}
                  style={{ 
                    backgroundColor: getLevelColor(certification.level) + '20',
                    color: getLevelColor(certification.level)
                  }}
                >
                  {certification.level}
                </span>
              </div>
            </div>
            
            <button 
              className={styles.getCertifiedButton}
              onClick={onGetCertified}
            >
              Get Certified
            </button>
            
            <p className={styles.testimonial}>
              Join {certification.testimonialCount} certified developers
            </p>
          </div>
          
          <div className={styles.companies}>
            <p className={styles.companiesTitle}>
              {certification.title} certified developers work at
            </p>
            <div className={styles.logos}>
              {certification.companyLogos.map((logo, index) => (
                <div key={index} className={styles.logo}>
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationDetailHero;
