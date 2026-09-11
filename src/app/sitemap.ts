import type { MetadataRoute } from 'next';
import { PUBLIC_SITEMAP_ROUTES, absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PUBLIC_SITEMAP_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' || path.startsWith('/guides') ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/guides' || path === '/solutions' ? 0.8 : 0.6,
  }));
}
