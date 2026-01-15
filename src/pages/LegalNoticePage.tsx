import React from 'react';
import './LegalPages.css';
import Footer from '../components/Footer';

const LegalNoticePage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Aviso Legal</h1>
        
        <section className="legal-section">
          <h2>Titular del sitio web</h2>
          <div className="legal-content">
            <p><strong>Nombre:</strong> Germán Nicolás Abreu</p>
            <p><strong>NIF:</strong> X5024287Y</p>
            <p><strong>Domicilio fiscal:</strong> Lanzarote, Islas Canarias, España</p>
            <p><strong>Correo electrónico:</strong> info@surfphotolanzarote.com</p>
            <p><strong>Sitio web:</strong> www.surfphotolanzarote.com</p>
            <p>Surf Photo Lanzarote es el responsable de la gestión y prestación del servicio descrito en esta web.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Propiedad Intelectual</h2>
          <div className="legal-content">
            <p>Todas las imágenes son propiedad intelectual de Surf Photo Lanzarote. Su compra solo otorga licencia personal y no transferible.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Responsabilidad</h2>
          <div className="legal-content">
            <p>Surf Photo Lanzarote no es responsable del uso indebido o distribución no autorizada de imágenes por parte de terceros.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Legislación Aplicable</h2>
          <div className="legal-content">
            <p>Estas condiciones se rigen por la normativa española. Conflictos se resolverán ante tribunales competentes en España.</p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default LegalNoticePage;