import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEO({ 
  title = 'Developer Toolbox',
  description = 'Your all-in-one developer toolkit with 20+ free utilities',
  keywords = 'developer tools, json formatter, api tester, code generator',
  image = '/favicon.svg',
  url
}) {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title.includes('Developer Toolbox') ? title : `${title} | Developer Toolbox`;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', 'website', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', image, 'name');

    // Additional SEO tags
    updateMetaTag('author', 'Poorana Selvan', 'name');
    updateMetaTag('robots', 'index, follow', 'name');
  }, [title, description, keywords, image, currentUrl]);

  return null;
}

function updateMetaTag(name, content, attribute = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}
