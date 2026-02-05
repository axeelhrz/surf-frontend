import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hace scroll al inicio de la página cada vez que cambia la ruta.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();

    // Repetir tras el siguiente paint por si el contenido se renderiza después
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop);
    });

    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
