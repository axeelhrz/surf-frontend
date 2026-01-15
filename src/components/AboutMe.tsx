import React from 'react';
import './AboutMe.css';
import { useLanguage } from '../contexts/LanguageContext';

const AboutMe: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="about-me" id="sobre-mi">
      <div className="about-me-container">
        <div className="about-me-image">
          <div className="image-wrapper">
            <img 
              src="/SOBREMI.jpg" 
              alt="Germán Abreu - Fotógrafo de surf en Lanzarote"
              className="photographer-image"
            />
            <div className="image-decoration">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="decoration-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="about-me-content">
          <div className="content-header">
            <span className="section-label">{t.aboutMe.label}</span>
            <h2 className="about-title">
              {t.aboutMe.title} <span className="highlight">{t.aboutMe.titleHighlight}</span>
            </h2>
          </div>

          <div className="about-text">
            <p className="intro-text" dangerouslySetInnerHTML={{ __html: t.aboutMe.intro }} />
            
            <p>{t.aboutMe.paragraph1}</p>
            
            <p dangerouslySetInnerHTML={{ __html: t.aboutMe.paragraph2 }} />
            
            <p className="mission-text" dangerouslySetInnerHTML={{ __html: t.aboutMe.mission }} />
          </div>

          <div className="about-stats">
            <div className="stat-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="stat-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="stat-value">{t.aboutMe.stats.experience}</span>
              <span className="stat-label">{t.aboutMe.stats.experienceLabel}</span>
            </div>
            <div className="stat-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="stat-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <span className="stat-value">{t.aboutMe.stats.schools}</span>
              <span className="stat-label">{t.aboutMe.stats.schoolsLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;