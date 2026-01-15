import React from 'react';
import './LegalPages.css';
import Footer from '../components/Footer';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Política de Privacidad</h1>
        
        <section className="legal-section">
          <h2>Responsable del tratamiento</h2>
          <div className="legal-content">
            <p>Surf Photo Lanzarote</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Datos personales tratados</h2>
          <div className="legal-content">
            <ul>
              <li>Correo electrónico</li>
              <li>Nombre</li>
              <li>Imagen facial (selfie)</li>
              <li>Datos técnicos de navegación</li>
              <li>Datos derivados de compras realizadas</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Finalidad del tratamiento</h2>
          <div className="legal-content">
            <ul>
              <li>Identificar fotografías mediante reconocimiento facial</li>
              <li>Gestionar compra, descarga y acceso a imágenes digitales</li>
              <li>Resolver incidencias y comunicaciones relacionadas con el servicio</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Reconocimiento Facial y Acceso Restringido</h2>
          <div className="legal-content">
            <p>La imagen facial enviada por el usuario se utiliza exclusivamente para clasificar y mostrar fotografías en las que aparece.</p>
            <p><strong>Surf Photo Lanzarote garantiza que:</strong></p>
            <ul>
              <li>No se crean bases de datos biométricas permanentes</li>
              <li>No se usan datos en publicidad ni venta a terceros</li>
              <li>No se comparten datos con terceros ajenos al servicio</li>
              <li>La imagen facial se elimina automáticamente tras completarse el proceso de identificación</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Acceso Restringido a Imágenes</h2>
          <div className="legal-content">
            <ul>
              <li>Solo el usuario que suba una selfie válida puede acceder a sus fotografías</li>
              <li>No existe catálogo público accesible sin identificación</li>
              <li>Las fotografías quedan inaccesibles para cualquier tercero sin coincidencia facial</li>
            </ul>
          </div>
        </section>

        <section className="legal-section">
          <h2>Conservación de Datos</h2>
          <div className="legal-content">
            <p>Los datos se conservan únicamente durante el tiempo necesario para prestar el servicio o cumplir obligaciones legales.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Derechos del Usuario</h2>
          <div className="legal-content">
            <p>El usuario podrá ejercer derechos de acceso, rectificación, supresión y oposición escribiendo a:</p>
            <p><strong>info@surfphotolanzarote.com</strong></p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Política de Cookies</h2>
          <div className="legal-content">
            <p>El sitio utiliza cookies técnicas y analíticas con el fin de mejorar la experiencia. El usuario podrá aceptarlas o rechazarlas.</p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;