import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { StoreData } from "../types";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Prisma database seeding from store.json...");

  const storePath = path.join(process.cwd(), "data", "store.json");
  let store: StoreData;

  try {
    const raw = await fs.readFile(storePath, "utf-8");
    store = JSON.parse(raw);
  } catch (err) {
    console.error("Could not read data/store.json, creating initial defaults", err);
    return;
  }

  // 1. Seed Profile
  if (store.profile) {
    await prisma.profile.upsert({
      where: { id: "profile_default" },
      update: {
        name: store.profile.name,
        moniker: store.profile.moniker,
        role: store.profile.role,
        tagline: store.profile.tagline,
        bio: JSON.stringify(store.profile.bio || []),
        location: store.profile.location,
        status: store.profile.status,
        email: store.profile.email,
        resumeUrl: store.profile.resumeUrl || null,
        socials: JSON.stringify(store.profile.socials || {}),
      },
      create: {
        id: "profile_default",
        name: store.profile.name,
        moniker: store.profile.moniker,
        role: store.profile.role,
        tagline: store.profile.tagline,
        bio: JSON.stringify(store.profile.bio || []),
        location: store.profile.location,
        status: store.profile.status,
        email: store.profile.email,
        resumeUrl: store.profile.resumeUrl || null,
        socials: JSON.stringify(store.profile.socials || {}),
      },
    });
    console.log("✓ Profile migrated");
  }

  // 2. Seed Admin Credentials
  if (store.admin) {
    await prisma.admin.upsert({
      where: { email: store.admin.email || "admin@developer.dev" },
      update: {
        password: store.admin.password,
        twoFactorSecret: store.admin.twoFactorSecret || null,
        twoFactorEnabled: store.admin.twoFactorEnabled ?? false,
      },
      create: {
        id: "admin_default",
        email: store.admin.email || "admin@developer.dev",
        password: store.admin.password,
        twoFactorSecret: store.admin.twoFactorSecret || null,
        twoFactorEnabled: store.admin.twoFactorEnabled ?? false,
      },
    });
    console.log("✓ Admin credentials migrated");
  }

  // 3. Seed Analytics
  if (store.analytics) {
    await prisma.analytics.upsert({
      where: { id: "analytics_default" },
      update: {
        pageViews: store.analytics.pageViews || 0,
        cvDownloads: store.analytics.cvDownloads || 0,
      },
      create: {
        id: "analytics_default",
        pageViews: store.analytics.pageViews || 0,
        cvDownloads: store.analytics.cvDownloads || 0,
      },
    });
    console.log("✓ Analytics migrated");
  }

  // 4. Seed Projects
  if (store.projects && store.projects.length > 0) {
    for (const project of store.projects) {
      await prisma.project.upsert({
        where: { slug: project.slug },
        update: {
          number: project.number,
          title: project.title,
          subtitle: project.subtitle || "",
          description: project.description || "",
          overview: project.overview || "",
          category: project.category || "General",
          year: project.year || 2026,
          technologies: JSON.stringify(project.technologies || []),
          thumbnail: project.thumbnail,
          images: JSON.stringify(project.images || []),
          featured: project.featured ?? false,
          published: project.published ?? true,
          github: project.github || "",
          demo: project.demo || "",
          role: project.role || "Software Developer",
          features: JSON.stringify(project.features || []),
          challenges: JSON.stringify(project.challenges || []),
        },
        create: {
          slug: project.slug,
          number: project.number,
          title: project.title,
          subtitle: project.subtitle || "",
          description: project.description || "",
          overview: project.overview || "",
          category: project.category || "General",
          year: project.year || 2026,
          technologies: JSON.stringify(project.technologies || []),
          thumbnail: project.thumbnail,
          images: JSON.stringify(project.images || []),
          featured: project.featured ?? false,
          published: project.published ?? true,
          github: project.github || "",
          demo: project.demo || "",
          role: project.role || "Software Developer",
          features: JSON.stringify(project.features || []),
          challenges: JSON.stringify(project.challenges || []),
        },
      });
    }
    console.log(`✓ ${store.projects.length} Projects migrated`);
  }

  // 5. Seed Skills
  if (store.skills && store.skills.length > 0) {
    await prisma.skillCategory.deleteMany({});
    for (let i = 0; i < store.skills.length; i++) {
      const cat = store.skills[i];
      await prisma.skillCategory.create({
        data: {
          title: cat.title,
          skills: JSON.stringify(cat.skills || []),
          order: i,
        },
      });
    }
    console.log(`✓ ${store.skills.length} Skill categories migrated`);
  }

  // 6. Seed Experiments
  if (store.experiments && store.experiments.length > 0) {
    for (const exp of store.experiments) {
      await prisma.experiment.upsert({
        where: { id: exp.id },
        update: {
          title: exp.title,
          category: exp.category,
          description: exp.description,
          year: exp.year,
          technologies: JSON.stringify(exp.technologies || []),
          link: exp.link || "",
          github: exp.github || "",
        },
        create: {
          id: exp.id,
          title: exp.title,
          category: exp.category,
          description: exp.description,
          year: exp.year,
          technologies: JSON.stringify(exp.technologies || []),
          link: exp.link || "",
          github: exp.github || "",
        },
      });
    }
    console.log(`✓ ${store.experiments.length} Experiments migrated`);
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
