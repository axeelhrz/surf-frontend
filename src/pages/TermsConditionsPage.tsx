import React from 'react';
import './LegalPages.css';
import Footer from '../components/Footer';

const TermsConditionsPage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Términos y Condiciones</h1>
        
        <section className="legal-section">
          <h2>Términos de Compra</h2>
          <div className="legal-content">
            <p><strong>Objeto:</strong> Compra y descarga de fotografías digitales.</p>
            <p><strong>Pagos:</strong> Procesados mediante Stripe. Surf Photo Lanzarote no almacena datos bancarios.</p>
            <p><strong>Entrega:</strong> Exclusivamente mediante descarga digital.</p>
            <p><strong>Precio e impuestos:</strong> Incluye IGIC vigente.</p>
            <p><strong>Derecho de desistimiento:</strong> No aplica una vez se inicie acceso o descarga del contenido digital.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Cesión de Imágenes a Escuelas Colaboradoras</h2>
          <div className="legal-content">
            <p>Las escuelas participantes podrán utilizar las fotografías captadas durante sus sesiones exclusivamente en:</p>
            <ul>
              <li>Redes sociales oficiales</li>
              <li>Página web propia</li>
              <li>Material de marketing relacionado con su actividad</li>
            </ul>
            <p>En ningún caso las escuelas podrán vender, ceder o sublicenciar dichas imágenes sin autorización expresa de Surf Photo Lanzarote.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Uso de Imágenes por Parte del Cliente</h2>
          <div className="legal-content">
            <p>Las fotografías adquiridas por el usuario:</p>
            <ul>
              <li>Son para uso personal y privado</li>
              <li>No otorgan derechos de explotación comercial ni publicitaria</li>
              <li>No autorizan su venta, cesión, publicación en medios comerciales o campañas sin consentimiento previo y escrito</li>
            </ul>
            <p>Para cualquier uso comercial, el cliente deberá solicitar autorización expresa a Surf Photo Lanzarote.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Imágenes de Menores de Edad</h2>
          <div className="legal-content">
            <p>Las escuelas colaboradoras deberán:</p>
            <ul>
              <li>Informar sobre el uso de las imágenes a padres o tutores</li>
              <li>Obtener autorización previa cuando sea legalmente requerida</li>
            </ul>
            <p>A solicitud de un progenitor o tutor legal, cualquier imagen será retirada de forma inmediata.</p>
          </div>
        </section>

        <section className="legal-section">
          <h2>Propiedad Intelectual</h2>
          <div className="legal-content">
            <p>Todas las imágenes son propiedad intelectual de Surf Photo Lanzarote. Su compra solo otorga licencia personal y no transferible.</p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default TermsConditionsPage;