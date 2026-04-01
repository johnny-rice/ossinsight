import type { Metadata } from 'next';

export const revalidate = 3600;

const imageUrl = 'https://ossinsight.io/trending-landscape';

export const metadata: Metadata = {
  title: 'Open Source Trending — Topic Landscape | OSSInsight',
  description: 'Discover trending open source repos grouped by topic. Real-time GitHub intelligence from OSSInsight.',
  openGraph: {
    title: 'Open Source Trending — Topic Landscape',
    description: 'Discover trending open source repos grouped by topic. Real-time GitHub intelligence.',
    images: [{ url: imageUrl, width: 1200, height: 630, alt: 'Open Source Trending Topic Landscape' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Source Trending — Topic Landscape',
    description: 'Discover trending open source repos grouped by topic.',
    images: [imageUrl],
  },
};

export default function ShareTrendingPage() {
  return <meta httpEquiv="refresh" content="0;url=/" />;
}
