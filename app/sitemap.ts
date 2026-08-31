import { MetadataRoute } from "next";
import { getProjects } from "@/lib/storage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://developer.dev";
  const projects = await getProjects(true);

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...projectUrls,
  ];
}
