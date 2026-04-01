import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Open Source Trending — Topic Landscape | OSSInsight',
  description: 'Discover trending open source repos grouped by topic. Real-time GitHub intelligence from OSSInsight.',
  openGraph: {
    title: 'Open Source Trending — Topic Landscape',
    description: 'Discover trending open source repos grouped by topic. Real-time GitHub intelligence from OSSInsight.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Source Trending — Topic Landscape',
    description: 'Discover trending open source repos grouped by topic.',
  },
};

export default function TrendingLandscapePage() {
  return (
    <meta httpEquiv="refresh" content="0;url=/" />
  );
}
