import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import {
  Project,
  Post,
  ContactMessage,
  Profile,
  SkillCategory,
  Experiment,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  CvData,
  CvExperience,
  CvEducation,
  CvProjectItem,
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
    subtitleId: p.subtitleId || undefined,
    description: p.description || "",
    descriptionId: p.descriptionId || undefined,
    overview: p.overview || "",
    overviewId: p.overviewId || undefined,
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
    roleId: p.roleId || undefined,
    deliveryStatus: p.deliveryStatus || "Production Ready",
    deliveryStatusId: p.deliveryStatusId || undefined,
    features: parseJson<string[]>(p.features, []),
    featuresId: parseJson<string[]>(p.featuresId, []),
    challenges: parseJson<string[]>(p.challenges, []),
    challengesId: parseJson<string[]>(p.challengesId, []),
  };
}

// Convert Prisma Post record to App Post type
function mapPrismaPost(p: any): Post {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    titleId: p.titleId || undefined,
    summary: p.summary,
    summaryId: p.summaryId || undefined,
    content: p.content,
    contentId: p.contentId || undefined,
    coverImage: p.coverImage || undefined,
    tags: parseJson<string[]>(p.tags, []),
    readingTime: p.readingTime || "4 min read",
    published: p.published ?? true,
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : new Date().toISOString(),
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
  };
}

// Convert Prisma ContactMessage record to App ContactMessage type
function mapPrismaMessage(m: any): ContactMessage {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject || undefined,
    budget: m.budget || undefined,
    message: m.message,
    read: m.read ?? false,
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
  };
}

// Convert Prisma Profile record to App Profile type
function mapPrismaProfile(p: any): Profile {
  if (!p) {
    return {
      name: "ARY DIAN PRATAMA",
      moniker: "ARY DIAN",
      role: "Website Developer",
      roleId: "Pengembang Web",
      tagline: "High-performance immersive digital experiences.",
      taglineId: "Pengalaman digital interaktif berkinerja tinggi.",
      bio: [],
      bioId: [],
      location: "Indonesia",
      status: "Available for work",
      statusId: "Tersedia untuk proyek kolaborasi",
      email: "arydianprtma@gmail.com",
      socials: { github: "", linkedin: "" },
    };
  }

  return {
    name: p.name,
    moniker: p.moniker,
    role: p.role,
    roleId: p.roleId || undefined,
    tagline: p.tagline,
    taglineId: p.taglineId || undefined,
    bio: parseJson<string[]>(p.bio, []),
    bioId: parseJson<string[]>(p.bioId, []),
    location: p.location,
    status: p.status,
    statusId: p.statusId || undefined,
    email: p.email,
    avatarUrl: p.avatarUrl || undefined,
    resumeUrl: p.resumeUrl || undefined,
    socials: parseJson(p.socials, { github: "", linkedin: "" }),
  };
}

export async function getStore(): Promise<StoreData> {
  try {
    const [dbProfile, dbProjects, dbPosts, dbMessages, dbSkills, dbExperiments, dbAdmin, dbAnalytics] =
      await Promise.all([
        prisma.profile?.findFirst ? prisma.profile.findFirst() : Promise.resolve(null),
        prisma.project?.findMany ? prisma.project.findMany({ orderBy: { number: "asc" } }) : Promise.resolve([]),
        prisma.post?.findMany ? prisma.post.findMany({ orderBy: { publishedAt: "desc" } }) : Promise.resolve([]),
        prisma.contactMessage?.findMany ? prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }) : Promise.resolve([]),
        prisma.skillCategory?.findMany ? prisma.skillCategory.findMany({ orderBy: { order: "asc" } }) : Promise.resolve([]),
        prisma.experiment?.findMany ? prisma.experiment.findMany() : Promise.resolve([]),
        prisma.admin?.findFirst ? prisma.admin.findFirst() : Promise.resolve(null),
        prisma.analytics?.findFirst ? prisma.analytics.findFirst() : Promise.resolve(null),
      ]);

    return {
      profile: mapPrismaProfile(dbProfile),
      projects: dbProjects.map(mapPrismaProject),
      posts: dbPosts.map(mapPrismaPost),
      messages: dbMessages.map(mapPrismaMessage),
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
      messages: [],
      profile: {
        name: "ARY DIAN PRATAMA",
        moniker: "ARY DIAN",
        role: "Website Developer",
        roleId: "Pengembang Web",
        tagline: "High-performance immersive digital experiences.",
        taglineId: "Pengalaman digital interaktif berkinerja tinggi.",
        bio: [],
        bioId: [],
        location: "Indonesia",
        status: "Available for work",
        statusId: "Tersedia untuk proyek kolaborasi",
        email: "arydianprtma@gmail.com",
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
    const allTimePageViews = analytics?.pageViews || 0;
    const allTimeCvDownloads = analytics?.cvDownloads || 0;
    const updatedAt = analytics?.updatedAt ? analytics.updatedAt.toISOString() : new Date().toISOString();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Query event counts from event logs
    const [
      todayViewsCount,
      weekViewsCount,
      monthViewsCount,
      totalViewsEventCount,
      todayCvCount,
      weekCvCount,
      monthCvCount,
      totalCvEventCount,
    ] = await Promise.all([
      prisma.pageViewEvent.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.pageViewEvent.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.pageViewEvent.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.pageViewEvent.count(),
      prisma.cvDownloadEvent.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.cvDownloadEvent.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.cvDownloadEvent.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.cvDownloadEvent.count(),
    ]);

    // If PageViewEvent is brand new, calculate proportional distribution from existing allTime counter
    let todayViews = todayViewsCount;
    let weekViews = weekViewsCount;
    let monthViews = monthViewsCount;
    const totalViews = Math.max(allTimePageViews, totalViewsEventCount);

    if (totalViewsEventCount === 0 && allTimePageViews > 0) {
      todayViews = Math.max(1, Math.round(allTimePageViews * 0.18));
      weekViews = Math.max(todayViews, Math.round(allTimePageViews * 0.65));
      monthViews = allTimePageViews;
    }

    let todayCv = todayCvCount;
    let weekCv = weekCvCount;
    let monthCv = monthCvCount;
    const totalCv = Math.max(allTimeCvDownloads, totalCvEventCount);

    if (totalCvEventCount === 0 && allTimeCvDownloads > 0) {
      todayCv = Math.max(1, Math.round(allTimeCvDownloads * 0.25));
      weekCv = Math.max(todayCv, Math.round(allTimeCvDownloads * 0.7));
      monthCv = allTimeCvDownloads;
    }

    return {
      pageViews: totalViews,
      cvDownloads: totalCv,
      pageViewsBreakdown: {
        today: todayViews,
        last7Days: weekViews,
        last30Days: monthViews,
        allTime: totalViews,
      },
      cvDownloadsBreakdown: {
        today: todayCv,
        last7Days: weekCv,
        last30Days: monthCv,
        allTime: totalCv,
      },
      lastUpdated: updatedAt,
    };
  } catch (err) {
    console.error("Error getting analytics:", err);
    return {
      pageViews: 0,
      cvDownloads: 0,
      pageViewsBreakdown: { today: 0, last7Days: 0, last30Days: 0, allTime: 0 },
      cvDownloadsBreakdown: { today: 0, last7Days: 0, last30Days: 0, allTime: 0 },
      lastUpdated: new Date().toISOString(),
    };
  }
}

export async function incrementPageView(metadata?: { path?: string; ip?: string; userAgent?: string }): Promise<number> {
  try {
    const existing = await prisma.analytics.findFirst();
    const id = existing ? existing.id : "analytics_default";

    // 1. Increment aggregate counter
    const [updated] = await Promise.all([
      prisma.analytics.upsert({
        where: { id },
        update: {
          pageViews: { increment: 1 },
        },
        create: {
          id,
          pageViews: 1,
          cvDownloads: 0,
        },
      }),
      // 2. Insert timestamped visit event
      prisma.pageViewEvent.create({
        data: {
          path: metadata?.path || "/",
          ip: metadata?.ip || null,
          userAgent: metadata?.userAgent || null,
        },
      }),
    ]);

    return updated.pageViews;
  } catch (err) {
    console.error("Error incrementing page view:", err);
    return 0;
  }
}

export async function incrementCvDownload(metadata?: { ip?: string; userAgent?: string }): Promise<number> {
  try {
    const existing = await prisma.analytics.findFirst();
    const id = existing ? existing.id : "analytics_default";

    const [updated] = await Promise.all([
      prisma.analytics.upsert({
        where: { id },
        update: {
          cvDownloads: { increment: 1 },
        },
        create: {
          id,
          pageViews: 0,
          cvDownloads: 1,
        },
      }),
      prisma.cvDownloadEvent.create({
        data: {
          ip: metadata?.ip || null,
          userAgent: metadata?.userAgent || null,
        },
      }),
    ]);

    return updated.cvDownloads;
  } catch (err) {
    console.error("Error incrementing cv download:", err);
    return 0;
  }
}

export async function resetAnalytics(): Promise<boolean> {
  try {
    const existing = await prisma.analytics.findFirst();
    const id = existing ? existing.id : "analytics_default";

    await Promise.all([
      prisma.analytics.upsert({
        where: { id },
        update: {
          pageViews: 0,
        },
        create: {
          id,
          pageViews: 0,
          cvDownloads: 0,
        },
      }),
      prisma.pageViewEvent.deleteMany({}),
    ]);

    return true;
  } catch (err) {
    console.error("Error resetting page views:", err);
    return false;
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
    subtitleId: projectData.subtitleId || null,
    description: projectData.description || "",
    descriptionId: projectData.descriptionId || null,
    overview: projectData.overview || "",
    overviewId: projectData.overviewId || null,
    category: projectData.category || "General",
    year: Number(projectData.year) || new Date().getFullYear(),
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
    roleId: projectData.roleId || null,
    deliveryStatus: projectData.deliveryStatus || "Production Ready",
    deliveryStatusId: projectData.deliveryStatusId || null,
    features: JSON.stringify(projectData.features || []),
    featuresId: JSON.stringify(projectData.featuresId || []),
    challenges: JSON.stringify(projectData.challenges || []),
    challengesId: JSON.stringify(projectData.challengesId || []),
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
    titleId: postData.titleId || null,
    summary: postData.summary || postData.content.slice(0, 160) + "...",
    summaryId: postData.summaryId || null,
    content: postData.content,
    contentId: postData.contentId || null,
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
// CONTACT INQUIRIES / INBOX QUERIES
// -------------------------------------------------------------
export async function getMessages(): Promise<ContactMessage[]> {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return messages.map(mapPrismaMessage);
  } catch (err) {
    console.error("Error fetching contact messages:", err);
    return [];
  }
}

export async function getMessageById(id: string): Promise<ContactMessage | undefined> {
  try {
    const msg = await prisma.contactMessage.findUnique({
      where: { id },
    });
    return msg ? mapPrismaMessage(msg) : undefined;
  } catch (err) {
    console.error("Error fetching message by id:", err);
    return undefined;
  }
}

export async function saveContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  budget?: string;
  message: string;
}): Promise<ContactMessage> {
  const record = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject || null,
      budget: data.budget || null,
      message: data.message,
      read: false,
    },
  });

  return mapPrismaMessage(record);
}

export async function markMessageAsRead(id: string, read = true): Promise<boolean> {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { read },
    });
    return true;
  } catch (err) {
    console.error("Error marking message as read:", err);
    return false;
  }
}

export async function deleteMessage(id: string): Promise<boolean> {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    return true;
  } catch (err) {
    console.error("Error deleting message:", err);
    return false;
  }
}

export async function getUnreadMessagesCount(): Promise<number> {
  try {
    return await prisma.contactMessage.count({
      where: { read: false },
    });
  } catch (err) {
    console.error("Error counting unread messages:", err);
    return 0;
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
      roleId: profileData.roleId || null,
      tagline: profileData.tagline,
      taglineId: profileData.taglineId || null,
      bio: JSON.stringify(profileData.bio || []),
      bioId: JSON.stringify(profileData.bioId || []),
      location: profileData.location,
      status: profileData.status,
      statusId: profileData.statusId || null,
      email: profileData.email,
      avatarUrl: profileData.avatarUrl || null,
      resumeUrl: profileData.resumeUrl || null,
      socials: JSON.stringify(profileData.socials || {}),
    },
    create: {
      id,
      name: profileData.name,
      moniker: profileData.moniker,
      role: profileData.role,
      roleId: profileData.roleId || null,
      tagline: profileData.tagline,
      taglineId: profileData.taglineId || null,
      bio: JSON.stringify(profileData.bio || []),
      bioId: JSON.stringify(profileData.bioId || []),
      location: profileData.location,
      status: profileData.status,
      statusId: profileData.statusId || null,
      email: profileData.email,
      avatarUrl: profileData.avatarUrl || null,
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

// -------------------------------------------------------------
// EXPERIMENTS LAB CRUD OPERATIONS
// -------------------------------------------------------------
function mapPrismaExperiment(e: any): Experiment {
  return {
    id: e.id,
    title: e.title,
    category: e.category,
    description: e.description,
    year: Number(e.year) || new Date().getFullYear(),
    technologies: parseJson<string[]>(e.technologies, []),
    link: e.link || undefined,
    github: e.github || undefined,
  };
}

export async function getExperiments(): Promise<Experiment[]> {
  try {
    const experiments = await prisma.experiment.findMany({
      orderBy: { year: "desc" },
    });
    return experiments.map(mapPrismaExperiment);
  } catch (err) {
    console.error("Error getting experiments:", err);
    return [];
  }
}

export async function saveExperiment(data: Partial<Experiment> & { title: string }): Promise<Experiment> {
  const id = data.id || `exp-${Date.now()}`;
  const record = await prisma.experiment.upsert({
    where: { id },
    update: {
      title: data.title,
      category: data.category || "Experimental",
      description: data.description || "",
      year: Number(data.year) || new Date().getFullYear(),
      technologies: JSON.stringify(data.technologies || []),
      link: data.link || null,
      github: data.github || null,
    },
    create: {
      id,
      title: data.title,
      category: data.category || "Experimental",
      description: data.description || "",
      year: Number(data.year) || new Date().getFullYear(),
      technologies: JSON.stringify(data.technologies || []),
      link: data.link || null,
      github: data.github || null,
    },
  });

  return mapPrismaExperiment(record);
}

export async function deleteExperiment(id: string): Promise<boolean> {
  try {
    await prisma.experiment.delete({
      where: { id },
    });
    return true;
  } catch (err) {
    console.error("Error deleting experiment:", err);
    return false;
  }
}

// -------------------------------------------------------------
// INVOICES CRUD OPERATIONS
// -------------------------------------------------------------
function mapPrismaInvoice(i: any): Invoice {
  return {
    id: i.id,
    invoiceNumber: i.invoiceNumber,
    clientName: i.clientName,
    clientEmail: i.clientEmail || undefined,
    clientAddress: i.clientAddress || undefined,
    clientPhone: i.clientPhone || undefined,
    status: (i.status as InvoiceStatus) || "PENDING",
    issueDate: i.issueDate ? new Date(i.issueDate).toISOString() : new Date().toISOString(),
    dueDate: i.dueDate ? new Date(i.dueDate).toISOString() : new Date().toISOString(),
    currency: i.currency || "IDR",
    items: parseJson<InvoiceItem[]>(i.items, []),
    subtotal: Number(i.subtotal) || 0,
    taxPercent: Number(i.taxPercent) || 0,
    taxAmount: Number(i.taxAmount) || 0,
    discountAmount: Number(i.discountAmount) || 0,
    total: Number(i.total) || 0,
    paymentDetails: i.paymentDetails || undefined,
    notes: i.notes || undefined,
    createdAt: i.createdAt ? new Date(i.createdAt).toISOString() : undefined,
    updatedAt: i.updatedAt ? new Date(i.updatedAt).toISOString() : undefined,
  };
}

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
    });
    return invoices.map(mapPrismaInvoice);
  } catch (err) {
    console.error("Error getting invoices:", err);
    return [];
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [{ id }, { invoiceNumber: id }],
      },
    });
    return invoice ? mapPrismaInvoice(invoice) : null;
  } catch (err) {
    console.error("Error getting invoice by id:", err);
    return null;
  }
}

export async function saveInvoice(data: Partial<Invoice> & { clientName: string }): Promise<Invoice> {
  // Generate invoice number if missing
  let invoiceNumber = data.invoiceNumber?.trim();
  if (!invoiceNumber) {
    const count = await prisma.invoice.count();
    const year = new Date().getFullYear();
    invoiceNumber = `INV-${year}-${String(count + 1).padStart(3, "0")}`;
  }

  // Calculate totals
  const items = data.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0
  );
  const taxPercent = Number(data.taxPercent) || 0;
  const taxAmount = (subtotal * taxPercent) / 100;
  const discountAmount = Number(data.discountAmount) || 0;
  const total = Math.max(0, subtotal + taxAmount - discountAmount);

  const payload = {
    invoiceNumber,
    clientName: data.clientName.trim(),
    clientEmail: data.clientEmail?.trim() || null,
    clientAddress: data.clientAddress?.trim() || null,
    clientPhone: data.clientPhone?.trim() || null,
    status: data.status || "PENDING",
    issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
    dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    currency: data.currency || "IDR",
    items: JSON.stringify(items),
    subtotal,
    taxPercent,
    taxAmount,
    discountAmount,
    total,
    paymentDetails: data.paymentDetails?.trim() || null,
    notes: data.notes?.trim() || null,
  };

  let record;
  if (data.id) {
    record = await prisma.invoice.update({
      where: { id: data.id },
      data: payload,
    });
  } else {
    record = await prisma.invoice.create({
      data: payload,
    });
  }

  return mapPrismaInvoice(record);
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice | null> {
  try {
    const record = await prisma.invoice.update({
      where: { id },
      data: { status },
    });
    return mapPrismaInvoice(record);
  } catch (err) {
    console.error("Error updating invoice status:", err);
    return null;
  }
}

export async function deleteInvoice(id: string): Promise<boolean> {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    return true;
  } catch (err) {
    console.error("Error deleting invoice:", err);
    return false;
  }
}

// -------------------------------------------------------------
// CV / RESUME GENERATOR STORAGE
// -------------------------------------------------------------
const CV_DATA_PATH = path.join(process.cwd(), "data", "cv.json");

function cleanCvSnippet(text?: string): string {
  if (!text) return "";
  const cleaned = text
    .replace(/###\s+/g, "")
    .replace(/##\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^[0-9]+\.\s*/gm, "")
    .replace(/^-\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 140 ? cleaned.slice(0, 137) + "..." : cleaned;
}

export async function generateDefaultCvFromProfile(): Promise<CvData> {
  const profile = await getProfile();
  const skills = await getSkills();
  const projects = await getProjects(true);

  const topProjects: CvProjectItem[] = projects.slice(0, 4).map((p, idx) => ({
    id: `proj-${idx + 1}`,
    title: p.title,
    role: p.role || "Lead Developer",
    technologies: p.technologies ? p.technologies.slice(0, 4) : [],
    link: p.demo || p.github || "",
    description: cleanCvSnippet(p.overview || p.description),
    highlights:
      p.features && p.features.length > 0
        ? p.features.slice(0, 2).map((f) => cleanCvSnippet(f))
        : [
            `Engineered high-performance web architecture using ${p.technologies.slice(0, 3).join(", ")}.`,
          ],
    enabled: idx < 2, // Enable top 2 projects by default to fit clean A4 page
  }));

  const skillCats = skills.map((s, idx) => ({
    category: s.title,
    skills: s.skills,
    enabled: idx < 3, // Enable first 3 categories by default
  }));

  return {
    template: "modern",
    language: "en",
    fullName: profile.name || "Ary Dian Pratama",
    jobTitle: profile.role || "Full Stack Developer & Systems Engineer",
    email: profile.email || "arydianprtma@gmail.com",
    phone: "+62 812-3456-7890",
    location: profile.location || "Kediri, East Java, Indonesia",
    website: "https://portfolio.ardp.my.id",
    github: profile.socials?.github || "https://github.com/arydianprtma",
    linkedin: profile.socials?.linkedin || "https://linkedin.com/in/arydianprtma",
    summary:
      Array.isArray(profile.bio) && profile.bio.length > 0
        ? profile.bio.join(" ")
        : "High-performance software engineer with extensive experience in Next.js, TypeScript, C#, and scalable web architectures. Passionate about crafting immersive, ultra-responsive digital products and robust full-stack systems.",
    showProjects: false,
    showExperience: true,
    showSkills: true,
    showEducation: true,
    showCertifications: true,
    experiences: [
      {
        id: "exp-1",
        role: "Full Stack Developer & Technical Lead",
        company: "Digital Craftsman / Freelance",
        location: "Remote / Indonesia",
        startDate: "2023",
        endDate: "Present",
        current: true,
        highlights: [
          "Architected and deployed responsive enterprise web applications using Next.js 16, TypeScript, Tailwind CSS, and PostgreSQL.",
          "Implemented robust authentication, role-based access control (RBAC), and automated invoice telemetry.",
          "Optimized front-end rendering pipelines achieving 99+ Lighthouse performance scores and sub-second page loads.",
        ],
      },
      {
        id: "exp-2",
        role: "Systems & Game Modding Developer",
        company: "Independent Software Projects",
        location: "Kediri, Indonesia",
        startDate: "2022",
        endDate: "2024",
        current: false,
        highlights: [
          "Engineered native C# memory hooks, real-time telemetry simulation, and custom UI components for complex systems.",
          "Built high-throughput multi-terminal Point of Sale (POS) and inventory synchronization engines.",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "Bachelor of Computer Science / Informatics",
        institution: "Universitas / Institute of Technology",
        location: "East Java, Indonesia",
        year: "2020 - 2024",
        details: "Focus on Software Engineering, Distributed Systems, and Web Technologies.",
      },
    ],
    projects: topProjects,
    skillCategories:
      skillCats.length > 0
        ? skillCats
        : [
            {
              category: "Frontend & UI",
              skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion"],
            },
            {
              category: "Backend & Database",
              skills: ["Node.js", "PostgreSQL", "Prisma ORM", "RESTful APIs", "Supabase"],
            },
            {
              category: "Languages & Tools",
              skills: ["TypeScript", "JavaScript", "C#", "Git", "Docker", "Linux"],
            },
          ],
    languages: ["Indonesian (Native)", "English (Professional Working Proficiency)"],
    certifications: [
      "Full-Stack Web Development Certification",
      "Modern Next.js & React Architecture Specialist",
    ],
    updatedAt: new Date().toISOString(),
  };
}

export async function getCvData(): Promise<CvData> {
  try {
    if (fs.existsSync(CV_DATA_PATH)) {
      const content = fs.readFileSync(CV_DATA_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && parsed.fullName) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading cv.json:", e);
  }
  return generateDefaultCvFromProfile();
}

export async function saveCvData(data: CvData): Promise<CvData> {
  try {
    const dir = path.dirname(CV_DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const updated: CvData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(CV_DATA_PATH, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch (e) {
    console.error("Error saving cv.json:", e);
    throw e;
  }
}



