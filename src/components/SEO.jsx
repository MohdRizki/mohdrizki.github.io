import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image = '/logo.png', type = 'website' }) {
  const siteTitle = 'ReezApps - Portofolio & Aplikasi Edukasi';
  const fullTitle = title ? `${title} - ${siteTitle}` : siteTitle;
  const metaDescription = description || 'Portofolio interaktif dan kumpulan aplikasi edukasi karya Mohamad Rizki.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
