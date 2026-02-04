import React, { useState } from 'react';
import './FAQ.css';
import { useLanguage } from '../contexts/LanguageContext';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = t.faqs.questions.map((q, index) => ({
    id: index + 1,
    question: q.q,
    answer: q.a,
  }));

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faqs">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">{t.faqs.title}</h2>
          <p className="faq-subtitle">
            {t.faqs.subtitle}
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="question-text">{faq.question}</span>
                <span className="faq-icon">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <div className="answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <p className="contact-text">
            {t.faqs.contactText}{' '}
            <a href="mailto:info@surfphotolanzarote.com" className="contact-link">
              {t.faqs.contactLink}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;