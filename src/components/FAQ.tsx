import React, { useState } from 'react';
import './FAQ.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: '¿Cómo encuentro mis fotos?',
      answer: 'Selecciona tu escuela de surf, el día de tu sesión y sube un selfie. La web te mostrará únicamente las fotos en las que apareces ese día.',
    },
    {
      id: 2,
      question: '¿Por qué tengo que subir un selfie?',
      answer: 'Utilizamos tecnología de reconocimiento facial para identificar tu rostro y mostrarte solo tus fotos, sin que tengas que buscarlas entre cientos de imágenes.',
    },
    {
      id: 3,
      question: '¿Qué pasa con el selfie que subo?',
      answer: 'El selfie se utiliza únicamente para realizar la búsqueda de ese día y no se almacena ni se utiliza con otros fines.',
    },
    {
      id: 4,
      question: '¿Puedo buscar fotos de varios días con un solo selfie?',
      answer: 'No. Cada búsqueda se realiza por día. Si surfeaste en días distintos, deberás subir un selfie en cada sesión para encontrar tus fotos.',
    },
    {
      id: 5,
      question: '¿Qué hago si somos dos o más personas?',
      answer: 'Cada persona debe subir su propio selfie para encontrar sus fotos. Puedes añadir las fotos de cada persona al carrito y continuar buscando sin problema.',
    },
    {
      id: 6,
      question: '¿Por qué las fotos tienen marca de agua?',
      answer: 'Las fotos se muestran con marca de agua para proteger el trabajo del fotógrafo. Tras la compra, podrás descargarlas sin marca de agua.',
    },
    {
      id: 7,
      question: '¿Qué calidad tienen las fotos descargadas?',
      answer: 'Las fotos se descargan en alta calidad, listas para uso personal y redes sociales.',
    },
    {
      id: 8,
      question: '¿Cuánto tiempo estarán disponibles mis fotos?',
      answer: 'Las fotos permanecen online durante un tiempo limitado. Te recomendamos descargarlas lo antes posible tras la compra.',
    },
    {
      id: 9,
      question: '¿Puedo comprar fotos de más de un día?',
      answer: 'Sí. Puedes acceder a diferentes días y comprar las fotos de cada sesión de forma independiente.',
    },
    {
      id: 10,
      question: '¿Las fotos son públicas?',
      answer: 'No. Las fotos están organizadas por escuela y día para que cada cliente acceda únicamente a su sesión.',
    },
    {
      id: 11,
      question: '¿Es seguro el pago?',
      answer: 'Sí. Todos los pagos se realizan a través de Stripe, una plataforma de pago segura y fiable.',
    },
    {
      id: 12,
      question: '¿Qué hago si no me encuentro o tengo un problema?',
      answer: 'Si no apareces en las fotos o tienes cualquier incidencia, puedes contactar con nosotros y te ayudaremos.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faqs">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Preguntas Frecuentes</h2>
          <p className="faq-subtitle">
            Encuentra respuestas a las dudas más comunes sobre cómo funciona Surf Photo Lanzarote
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
            ¿No encuentras la respuesta que buscas?{' '}
            <a href="#footer" className="contact-link">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;