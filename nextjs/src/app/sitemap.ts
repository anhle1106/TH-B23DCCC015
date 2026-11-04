import { MetadataRoute } from 'next';
import { getDeadlines, getSubjects } from '@/lib/deadlines';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  // Static root routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // Subject routes (SSG)
  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((sub) => ({
    url: `${baseUrl}/subjects/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Deadlines detail routes (ISR)
  const deadlineRoutes: MetadataRoute.Sitemap = deadlines.map((d) => ({
    url: `${baseUrl}/deadlines/${d.id}`,
    lastModified: new Date(d.createdAt || new Date()),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
