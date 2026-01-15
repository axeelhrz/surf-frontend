import React from 'react';
import './HowItWorks.css';
import { useLanguage } from '../contexts/LanguageContext';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      number: 1,
      title: t.howItWorks.step1.title,
      description: t.howItWorks.step1.description,
      image: '/7N5A0530.JPG',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="step-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
      color: '#B24A3B'
    },
    {
      number: 2,
      title: t.howItWorks.step2.title,
      description: t.howItWorks.step2.description,
      image: '/7N5A0773.jpg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="step-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      color: '#C85A4A'
    },
    {
      number: 3,
      title: t.howItWorks.step3.title,
      description: t.howItWorks.step3.description,
      image: '/7N5A1361.jpg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="step-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
      ),
      color: '#D66A58'
    },
    {
      number: 4,
      title: t.howItWorks.step4.title,
      description: t.howItWorks.step4.description,
      image: '/7N5A2536.jpg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="step-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
      color: '#A03D30'
    },
    {
      number: 5,
      title: t.howItWorks.step5.title,
      description: t.howItWorks.step5.description,
      image: '/7N5A4158.jpg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="step-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      color: '#E47A66'
    },
    {
      number: 6,
      title: t.howItWorks.step6.title,
      description: t.howItWorks.step6.description,
      image: '/7N5A6375.jpg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="step-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
      color: '#8a3a2d'
    },
    {
      number: 7,
      title: t.howItWorks.step7.title,
      description: t.howItWorks.step7.description,
      image: '/7N5A8618.jpg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="step-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
      color: '#F28A74'
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-wrapper">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">{t.howItWorks.title}</h2>
          <p className="how-it-works-subtitle">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="steps-grid">
          {/* Grupo 1: Pasos 1 y 2 */}
          <div className="step-row">
            <div className="step-card" style={{ borderTopColor: steps[0].color }}>
              <div className="step-icon-wrapper" style={{ backgroundColor: steps[0].color }}>
                {steps[0].icon}
              </div>
              <div className="step-badge" style={{ backgroundColor: steps[0].color }}>
                {steps[0].number}
              </div>
              <h3 className="step-title">{steps[0].title}</h3>
              <p className="step-description">{steps[0].description}</p>
            </div>

            <div className="step-card" style={{ borderTopColor: steps[1].color }}>
              <div className="step-icon-wrapper" style={{ backgroundColor: steps[1].color }}>
                {steps[1].icon}
              </div>
              <div className="step-badge" style={{ backgroundColor: steps[1].color }}>
                {steps[1].number}
              </div>
              <h3 className="step-title">{steps[1].title}</h3>
              <p className="step-description">{steps[1].description}</p>
            </div>
          </div>

          {/* Grupo 2: Pasos 3 y 4 */}
          <div className="step-row">
            <div className="step-card" style={{ borderTopColor: steps[2].color }}>
              <div className="step-icon-wrapper" style={{ backgroundColor: steps[2].color }}>
                {steps[2].icon}
              </div>
              <div className="step-badge" style={{ backgroundColor: steps[2].color }}>
                {steps[2].number}
              </div>
              <h3 className="step-title">{steps[2].title}</h3>
              <p className="step-description">{steps[2].description}</p>
            </div>

            <div className="step-card" style={{ borderTopColor: steps[3].color }}>
              <div className="step-icon-wrapper" style={{ backgroundColor: steps[3].color }}>
                {steps[3].icon}
              </div>
              <div className="step-badge" style={{ backgroundColor: steps[3].color }}>
                {steps[3].number}
              </div>
              <h3 className="step-title">{steps[3].title}</h3>
              <p className="step-description">{steps[3].description}</p>
            </div>
          </div>

          {/* Grupo 3: Pasos 5 y 6 */}
          <div className="step-row">
            <div className="step-card" style={{ borderTopColor: steps[4].color }}>
              <div className="step-icon-wrapper" style={{ backgroundColor: steps[4].color }}>
                {steps[4].icon}
              </div>
              <div className="step-badge" style={{ backgroundColor: steps[4].color }}>
                {steps[4].number}
              </div>
              <h3 className="step-title">{steps[4].title}</h3>
              <p className="step-description">{steps[4].description}</p>
            </div>

            <div className="step-card" style={{ borderTopColor: steps[5].color }}>
              <div className="step-icon-wrapper" style={{ backgroundColor: steps[5].color }}>
                {steps[5].icon}
              </div>
              <div className="step-badge" style={{ backgroundColor: steps[5].color }}>
                {steps[5].number}
              </div>
              <h3 className="step-title">{steps[5].title}</h3>
              <p className="step-description">{steps[5].description}</p>
            </div>
          </div>

          {/* Paso 7 - Centrado */}
          <div className="step-row step-row-single">
            <div className="step-card step-card-highlight" style={{ borderTopColor: steps[6].color }}>
              <div className="step-icon-wrapper" style={{ backgroundColor: steps[6].color }}>
                {steps[6].icon}
              </div>
              <div className="step-badge" style={{ backgroundColor: steps[6].color }}>
                {steps[6].number}
              </div>
              <h3 className="step-title">{steps[6].title}</h3>
              <p className="step-description">{steps[6].description}</p>
            </div>
          </div>
        </div>

        {/* Nota especial sobre reconocimiento facial */}
        <div className="facial-recognition-note">
          <div className="note-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="note-icon-svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <div className="note-content">
            <h4>{t.howItWorks.smartSearch.title}</h4>
            <p>{t.howItWorks.smartSearch.description}</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="how-it-works-cta">
          <a href="/schools" className="btn btn-primary btn-large">
            {t.howItWorks.cta}
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;