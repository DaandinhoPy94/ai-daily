import { Helmet } from 'react-helmet-async';
import { SectionList } from '@/components/SectionList';
import { getTopicSEO, buildCanonical } from '@/lib/seo';

export default function Regelgeving() {
  const seo = getTopicSEO('Regelgeving & Beleid');
  const canonical = buildCanonical('/regelgeving');

  return (
    <>
      <Helmet>
        <html lang="nl" />
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
      </Helmet>
      <SectionList title="Regelgeving" topicSlug="regelgeving" />
    </>
  );
}