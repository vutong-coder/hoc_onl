import React from 'react';
import styles from '../../assets/css/CertifyHero.module.css';

const CertifyHero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Get Certified</h1>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>Stand out from the crowd</h3>
              <p className={styles.featureDescription}>
                Get certified in technical skills by taking the HackerRank Certification Test
              </p>
            </div>
            
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>Standardised Assessment</h3>
              <p className={styles.featureDescription}>
                Assessments are organised around specific skills and are carefully curated based on years of recruiting data from 2000+ companies
              </p>
            </div>
            
            <div className={styles.feature}>
              <h3 className={styles.featureTitle}>Enrich your profile</h3>
              <p className={styles.featureDescription}>
                Upon successfully clearing an assessment, you can promote yourself using the HackerRank certificate to peers and employers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertifyHero;
