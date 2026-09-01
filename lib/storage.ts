import { prisma } from "@/lib/prisma";
import {
  Project,
  Post,
  Profile,
  SkillCategory,
  Experiment,
  StoreData,
  AdminCredentials,
  AnalyticsData,
} from "@/types";

// Helper to deserialize JSON fields safely
function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Convert Prisma Project record to App Project type
function mapPrismaProject(p: any): Project {
  return {
    slug: p.slug,
    number: p.number,
    title: p.title,
    subtitle: p.subtitle || "",
    description: p.description || "",
    overview: p.overview || "",
    category: p.category || "General",
    year: p.year || 2026,
    technologies: parseJson<string[]>(p.technologies, []),
    thumbnail: p.thumbnail,
    images: parseJson<string[]>(p.images, []),
    featured: p.featured ?? false,
    published: p.published ?? true,
    github: p.github || "",
    demo: p.demo || "",
    role: p.role || "Software Developer",
    features: parseJson<string[]>(p.features, []),
    challenges: parseJson<string[]>(p.challenges, []),
  };
}

// Convert Prisma Post record to App Post type
function mapPrismaPost(p: any): Post {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    content: p.content,
    coverImage: p.coverImage || undefined,
    tags: parseJson<string[]>(p.tags, []),
    readingTime: p.readingTime || "4 min read",
    published: p.published ?? true,
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : new Date().toISOString(),
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
  };
}

// Convert Prisma Profile record to App Profile type
function mapPrismaProfile(p: any): Profile {
  if (!p) {
    return {
      name: "BOS",
      moniker: "BOS",
      role: "Software Developer",
      tagline: "I build digital things.",
      bio: [],
      location: "Indonesia",
      status: "Available for work",
      email: "contact@developer.dev",
      socials: { github: "", linkedin: "" },
    };
  }

  return {
    name: p.name,
    moniker: p.moniker,
    role: p.role,
    tagline: p.tagline,
    bio: parseJson<string[]>(p.bio, []),
    location: p.location,
    status: p.status,
    email: p.email,
    resumeUrl: p.resumeUrl || undefined,
    socials: parseJson(p.socials, { github: "", linkedin: "" }),
  };
}

export async function getStore(): Promise<StoreData> {
  try {
    const [dbProfile, dbProjects, dbPosts, dbSkills, dbExperiments, dbAdmin, dbAnalytics] =
      await Promise.all([
        prisma.profile?.findFirst ? prisma.profile.findFirst() : Promise.resolve(null),
        prisma.project?.findMany ? prisma.project.findMany({ orderBy: { number: "asc" } }) : Promise.resolve([]),
        prisma.post?.findMany ? prisma.post.findMany({ orderBy: { publishedAt: "desc" } }) : Promise.resolve([]),
        prisma.skillCategory?.findMany ? prisma.skillCategory.findMany({ orderBy: { order: "asc" } }) : Promise.resolve([]),
        prisma.experiment?.findMany ? prisma.experiment.findMany() : Promise.resolve([]),
        prisma.admin?.findFirst ? prisma.admin.findFirst() : Promise.resolve(null),
        prisma.analytics?.findFirst ? prisma.analytics.findFirst() : Promise.resolve(null),
      ]);

    return {
      profile: mapPrismaProfile(dbProfile),
      projects: dbProjects.map(mapPrismaProject),
      posts: dbPosts.map(mapPrismaPost),
      skills: dbSkills.map((s) => ({
        title: s.title,
        skills: parseJson<string[]>(s.skills, []),
      })),
      experiments: dbExperiments.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        description: e.description,
        year: e.year,
        technologies: parseJson<string[]>(e.technologies, []),
        link: e.link || undefined,
        github: e.github || undefined,
      })),
      admin: dbAdmin
        ? {
            email: dbAdmin.email,
            password: dbAdmin.password,
            twoFactorSecret: dbAdmin.twoFactorSecret || undefined,
            twoFactorEnabled: dbAdmin.twoFactorEnabled,
          }
        : {
            email: process.env.ADMIN_EMAIL || "admin@developer.dev",
            password: process.env.ADMIN_PASSWORD || "adminpassword123",
          },
      analytics: dbAnalytics
        ? {
            pageViews: dbAnalytics.pageViews,
            cvDownloads: dbAnalytics.cvDownloads,
            lastUpdated: dbAnalytics.updatedAt.toISOString(),
          }
        : {
            pageViews: 0,
            cvDownloads: 0,
            lastUpdated: new Date().toISOString(),
          },
    };
  } catch (error) {
    console.error("Error reading from Prisma database:", error);
    return {
      projects: [],
      posts: [],
      profile: {
        name: "BOS",
        moniker: "BOS",
        role: "Software Developer",
        tagline: "I build digital things.",
        bio: [],
        location: "Indonesia",
        status: "Available for work",
        email: "contact@developer.dev",
        socials: { github: "", linkedin: "" },
      },
      skills: [],
      experiments: [],
      admin: {
        email: process.env.ADMIN_EMAIL || "admin@developer.dev",
        password: process.env.ADMIN_PASSWORD || "adminpassword123",
      },
      analytics: {
        pageViews: 0,
        cvDownloads: 0,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}

export async function getAdminCredentials(): Promise<AdminCredentials> {
  try {
    const admin = await prisma.admin.findFirst();
    if (admin) {
      return {
        email: admin.email,
        password: admin.password,
        twoFactorSecret: admin.twoFactorSecret || undefined,
        twoFactorEnabled: admin.twoFactorEnabled,
      };
    }
  } catch (err) {
    console.error("Error getting admin credentials:", err);
  }

  return {
    email: process.env.ADMIN_EMAIL || "admin@developer.dev",
    password: process.env.ADMIN_PASSWORD || "adminpassword123",
  };
}

export async function updateAdminCredentials(credentials: AdminCredentials): Promise<void> {
  const existing = await prisma.admin.findFirst();
  const id = existing ? existing.id : "admin_default";

  await prisma.admin.upsert({
    where: { id },
    update: {
      email: credentials.email,
      password: credentials.password,
      twoFactorSecret: credentials.twoFactorSecret || null,
      twoFactorEnabled: credentials.twoFactorEnabled ?? false,
    },
    create: {
      id,
      email: credentials.email,
      password: credentials.password,
      twoFactorSecret: credentials.twoFactorSecret || null,
      twoFactorEnabled: credentials.twoFactorEnabled ?? false,
    },
  });
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const analytics = await prisma.analytics.findFirst();
    if (analytics) {
      return {
        pageViews: analytics.pageViews,
        cvDownloads: analytics.cvDownloads,
        lastUpdated: analytics.updatedAt.toISOString(),
      };
    }
  } catch (err) {
    console.error("Error getting analytics:", err);
  }

  return {
    pageViews: 0,
    cvDownloads: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export async function incrementPageView(): Promise<number> {
  try {
    const existing = await prisma.analytics.findFirst();
    const id = existing ? existing.id : "analytics_default";

    const updated = await prisma.analytics.upsert({
      where: { id },
      update: {
        pageViews: { increment: 1 },
      },
      create: {
        id,
        pageViews: 1,
        cvDownloads: 0,
      },
    });
    return updated.pageViews;
  } catch (err) {
    console.error("Error incrementing page view:", err);
    return 0;
  }
}

export async function incrementCvDownload(): Promise<number> {
  try {
    const existing = await prisma.analytics.findFirst();
    const id = existing ? existing.id : "analytics_default";

    const updated = await prisma.analytics.upsert({
      where: { id },
      update: {
        cvDownloads: { increment: 1 },
      },
      create: {
        id,
        pageViews: 0,
        cvDownloads: 1,
      },
    });
    return updated.cvDownloads;
  } catch (err) {
    console.error("Error incrementing cv download:", err);
    return 0;
  }
}

// -------------------------------------------------------------
// PROJECTS QUERIES
// -------------------------------------------------------------
export async function getProjects(onlyPublished = false): Promise<Project[]> {
  try {
    const where = onlyPublished ? { published: true } : {};
    const projects = await prisma.project.findMany({
      where,
      orderBy: { number: "asc" },
    });
    return projects.map(mapPrismaProject);
  } catch (err) {
    console.error("Error fetching projects:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    });
    return project ? mapPrismaProject(project) : undefined;
  } catch (err) {
    console.error("Error fetching project by slug:", err);
    return undefined;
  }
}

export async function saveProject(projectData: Partial<Project> & { title: string }): Promise<Project> {
  const slug =
    projectData.slug ||
    projectData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const count = await prisma.project.count();
  const number = projectData.number || String(count + 1).padStart(2, "0");

  const data = {
    slug,
    number,
    title: projectData.title,
    subtitle: projectData.subtitle || "",
    description: projectData.description || "",
    overview: projectData.overview || "",
    category: projectData.category || "General",
    year: projectData.year || new Date().getFullYear(),
    technologies: JSON.stringify(projectData.technologies || []),
    thumbnail:
      projectData.thumbnail ||
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
    images: JSON.stringify(projectData.images || []),
    featured: projectData.featured ?? false,
    published: projectData.published ?? true,
    github: projectData.github || "",
    demo: projectData.demo || "",
    role: projectData.role || "Software Developer",
    features: JSON.stringify(projectData.features || []),
    challenges: JSON.stringify(projectData.challenges || []),
  };

  const project = await prisma.project.upsert({
    where: { slug },
    update: data,
    create: data,
  });

  return mapPrismaProject(project);
}

export async function deleteProject(slug: string): Promise<boolean> {
  try {
    await prisma.project.delete({
      where: { slug },
    });
    return true;
  } catch (err) {
    console.error("Error deleting project:", err);
    return false;
  }
}

// -------------------------------------------------------------
// POSTS / ARTICLES QUERIES
// -------------------------------------------------------------
export async function getPosts(onlyPublished = false): Promise<Post[]> {
  try {
    const where = onlyPublished ? { published: true } : {};
    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    });
    return posts.map(mapPrismaPost);
  } catch (err) {
    console.error("Error fetching posts:", err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });
    return post ? mapPrismaPost(post) : undefined;
  } catch (err) {
    console.error("Error fetching post by slug:", err);
    return undefined;
  }
}

export async function savePost(
  postData: Partial<Post> & { title: string; content: string }
): Promise<Post> {
  const slug =
    postData.slug ||
    postData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Calculate estimated reading time
  const words = (postData.content || "").split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  const readingTime = postData.readingTime || `${minutes} min read`;

  const data = {
    slug,
    title: postData.title,
    summary: postData.summary || postData.content.slice(0, 160) + "...",
    content: postData.content,
    coverImage: postData.coverImage || null,
    tags: JSON.stringify(postData.tags || ["Engineering", "Web Dev"]),
    readingTime,
    published: postData.published ?? true,
    publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : new Date(),
  };

  const post = await prisma.post.upsert({
    where: { slug },
    update: data,
    create: data,
  });

  return mapPrismaPost(post);
}

export async function deletePost(slug: string): Promise<boolean> {
  try {
    await prisma.post.delete({
      where: { slug },
    });
    return true;
  } catch (err) {
    console.error("Error deleting post:", err);
    return false;
  }
}

// -------------------------------------------------------------
// PROFILE & SKILLS QUERIES
// -------------------------------------------------------------
export async function getProfile(): Promise<Profile> {
  try {
    const profile = await prisma.profile.findFirst();
    return mapPrismaProfile(profile);
  } catch (err) {
    console.error("Error getting profile:", err);
    return mapPrismaProfile(null);
  }
}

export async function updateProfile(profileData: Profile): Promise<Profile> {
  const existing = await prisma.profile.findFirst();
  const id = existing ? existing.id : "profile_default";

  const updated = await prisma.profile.upsert({
    where: { id },
    update: {
      name: profileData.name,
      moniker: profileData.moniker,
      role: profileData.role,
      tagline: profileData.tagline,
      bio: JSON.stringify(profileData.bio || []),
      location: profileData.location,
      status: profileData.status,
      email: profileData.email,
      resumeUrl: profileData.resumeUrl || null,
      socials: JSON.stringify(profileData.socials || {}),
    },
    create: {
      id,
      name: profileData.name,
      moniker: profileData.moniker,
      role: profileData.role,
      tagline: profileData.tagline,
      bio: JSON.stringify(profileData.bio || []),
      location: profileData.location,
      status: profileData.status,
      email: profileData.email,
      resumeUrl: profileData.resumeUrl || null,
      socials: JSON.stringify(profileData.socials || {}),
    },
  });

  return mapPrismaProfile(updated);
}

export async function getSkills(): Promise<SkillCategory[]> {
  try {
    const skills = await prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
    });
    return skills.map((s) => ({
      title: s.title,
      skills: parseJson<string[]>(s.skills, []),
    }));
  } catch (err) {
    console.error("Error getting skills:", err);
    return [];
  }
}

export async function updateSkills(categories: SkillCategory[]): Promise<SkillCategory[]> {
  await prisma.skillCategory.deleteMany({});
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    await prisma.skillCategory.create({
      data: {
        title: cat.title,
        skills: JSON.stringify(cat.skills || []),
        order: i,
      },
    });
  }
  return categories;
}
