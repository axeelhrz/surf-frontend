import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>{t.footer.brand}</h4>
          <p>{t.footer.description}</p>
        </div>
        <div className="footer-section">
          <h4>{t.footer.navigation}</h4>
          <ul>
            <li><Link to="/">{t.footer.home}</Link></li>
            <li><Link to="/schools">{t.footer.schools}</Link></li>
            <li><Link to="/how-it-works">{t.footer.howItWorks}</Link></li>
            <li><Link to="/pricing">{t.footer.pricing}</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>{t.footer.legal}</h4>
          <ul>
            <li><Link to="/legal-notice">{t.footer.legalNotice}</Link></li>
            <li><Link to="/privacy-policy">{t.footer.privacy}</Link></li>
            <li><Link to="/terms-conditions">{t.footer.terms}</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>{t.footer.contact}</h4>
          <p>{t.footer.email}</p>
          <p>{t.footer.location}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 {t.footer.brand}. {t.footer.rights}.</p>
      </div>
    </footer>
  );
};

export default Footer;