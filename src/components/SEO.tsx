import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "SMKN 4 Mataram", 
  description = "Website Resmi SMKN 4 Mataram. Menjadi institusi unggul dalam mencetak lulusan yang kompeten, berkarakter, dan berdaya saing.",
  image = "/default-og.JPG", // Disarankan memiliki gambar cover default
  url = "https://smkn4mtr.sch.id"
}) => {
  const pageTitle = title === "SMKN 4 Mataram" ? title : `${title} | SMKN 4 Mataram`;

  return (
    <Head>
      <title key="title">{pageTitle}</title>
      <meta name="description" content={description} key="description" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" key="ogtype" />
      <meta property="og:url" content={url} key="ogurl" />
      <meta property="og:title" content={pageTitle} key="ogtitle" />
      <meta property="og:description" content={description} key="ogdesc" />
      <meta property="og:image" content={image} key="ogimage" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" key="twcard" />
      <meta property="twitter:url" content={url} key="twurl" />
      <meta property="twitter:title" content={pageTitle} key="twtitle" />
      <meta property="twitter:description" content={description} key="twdesc" />
      <meta property="twitter:image" content={image} key="twimage" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default SEO;
