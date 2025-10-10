import React from 'react';
import styles from '../../assets/css/CertifyFooter.module.css';

const CertifyFooter: React.FC = () => {
  const footerLinks = [
    'Blog',
    'Scoring',
    'Environment',
    'FAQ',
    'About Us',
    'Helpdesk',
    'Careers',
    'Terms Of Service',
    'Privacy Policy'
  ];

  const handleLinkClick = (link: string) => {
    console.log(`Clicked on ${link}`);
    // In a real app, these would navigate to appropriate pages
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          {footerLinks.map((link, index) => (
            <React.Fragment key={link}>
              <button
                className={styles.link}
                onClick={() => handleLinkClick(link)}
                type="button"
              >
                {link}
              </button>
              {index < footerLinks.length - 1 && (
                <span className={styles.separator}>|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default CertifyFooter;
