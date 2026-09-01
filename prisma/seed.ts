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
    const idBio = [
      "Saya adalah seorang Website Developer yang berfokus pada rekayasa aplikasi web berkinerja tinggi serta merancang pengalaman digital yang imersif dan interaktif. Saya memprioritaskan kecepatan akses, stabilitas sistem, dan arsitektur kode yang bersih pada setiap solusi yang saya bangun.",
      "Dengan memadukan teknologi web modern dan presisi animasi antarmuka, saya merancang produk digital yang responsif dan teroptimasi penuh guna menghadirkan pengalaman visual yang mulus bagi setiap pengguna."
    ];

    await prisma.profile.upsert({
      where: { id: "profile_default" },
      update: {
        name: store.profile.name,
        moniker: store.profile.moniker,
        role: store.profile.role,
        roleId: "Website Developer",
        tagline: store.profile.tagline,
        taglineId: "Pengalaman digital interaktif berkinerja tinggi.",
        bio: JSON.stringify(store.profile.bio || []),
        bioId: JSON.stringify(idBio),
        location: store.profile.location,
        status: store.profile.status,
        statusId: "Tersedia untuk peluang kerja sama & proyek baru",
        email: store.profile.email,
        resumeUrl: store.profile.resumeUrl || null,
        socials: JSON.stringify(store.profile.socials || {}),
      },
      create: {
        id: "profile_default",
        name: store.profile.name,
        moniker: store.profile.moniker,
        role: store.profile.role,
        roleId: "Website Developer",
        tagline: store.profile.tagline,
        taglineId: "Pengalaman digital interaktif berkinerja tinggi.",
        bio: JSON.stringify(store.profile.bio || []),
        bioId: JSON.stringify(idBio),
        location: store.profile.location,
        status: store.profile.status,
        statusId: "Tersedia untuk peluang kerja sama & proyek baru",
        email: store.profile.email,
        resumeUrl: store.profile.resumeUrl || null,
        socials: JSON.stringify(store.profile.socials || {}),
      },
    });
    console.log("✓ Profile migrated with dual language bio");
  }

  // 2. Seed Admin Credentials
  if (store.admin) {
    await prisma.admin.upsert({
      where: { id: "admin_default" },
      update: {
        email: store.admin.email || "admin@developer.dev",
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

  // 5. Seed Initial Posts / Articles
  const initialPosts = [
    {
      slug: "building-high-performance-interactive-web-apps",
      title: "Building High-Performance & Immersive Web Applications",
      summary:
        "An architectural deep-dive into orchestrating 60+ FPS web interactions with GSAP ScrollTrigger, Next.js Turbopack, and low overhead server components.",
      readingTime: "5 min read",
      tags: JSON.stringify(["Next.js", "Performance", "GSAP", "Architecture"]),
      coverImage:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop",
      content: `In the modern web ecosystem, creating visually stunning experiences must never come at the expense of load speed, battery efficiency, and accessibility.

## 01. The Performance Paradox in Web Motion

Many digital agencies fall into the trap of loading heavy 3D frameworks and unoptimized animation runtimes that stutter on mobile devices and drain CPU cycles.

> High performance is not a post-launch optimization—it is an architectural discipline embedded in every line of code from day one.

When crafting immersive web portfolios and enterprise client dashboards, we prioritize **pure GPU-accelerated compositing** and minimal DOM thrashing.

### Key Architectural Principles:
1. **Transform and Opacity Only**: Always restrict ScrollTrigger tweens to \`transform\` (\`x\`, \`y\`, \`scale\`) and \`opacity\` to avoid triggering continuous browser layout reflows.
2. **Server-Rendered Baseline**: Ensure all content, metadata, and OpenGraph tags are prerendered on the server so search engines and users get instantaneous First Contentful Paint (FCP).
3. **Hardware Acceleration**: Use CSS \`will-change\` sparingly and let modern rendering engines handle GPU layers automatically.

\`\`\`ts
// Optimized GSAP ScrollTrigger context cleanup
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(elementRef.current, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });
  }, containerRef);

  return () => ctx.revert(); // Prevent memory leaks
}, []);
\`\`\`

## 02. Summary & The Future of Interactive Web

By combining Next.js 16's fast server streaming with meticulous GSAP timeline orchestration, developers can deliver experiences that feel as responsive and tactile as native desktop applications.`,
      published: true,
      publishedAt: new Date("2026-08-30"),
    },
    {
      slug: "mastering-dark-mode-editorial-design-systems",
      title: "Crafting Cyber-Minimalist Design Systems for the Modern Web",
      summary:
        "Why high-contrast editorial dark themes, monospaced data telemetry, and tactical micro-animations create unforgettable digital brand identities.",
      readingTime: "4 min read",
      tags: JSON.stringify(["UI/UX", "Design Systems", "Typography", "CSS"]),
      coverImage:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
      content: `Visual hierarchy is the cornerstone of great software engineering portfolios. When an engineering recruiter or enterprise client lands on your portfolio, they form an impression in less than 300 milliseconds.

## 01. High-Contrast Monochromatic Foundations

A cyber-minimalist design system relies on a restrained color palette:
- **Background**: Absolute obsidian dark (\`#0A0A0A\`) with secondary dark elevation (\`#101010\` and \`#141414\`).
- **Foreground**: Crisp optical white (\`#F5F5F5\`) and calibrated muted grays (\`#888888\`, \`#A0A0A0\`).
- **Accent Beacon**: Precise Crimson Red (\`#E31B23\`) for focal points, magnetic buttons, and telemetry indicators.

> Constraint breeds aesthetic clarity. By limiting colors to high-contrast tones, typography and content take center stage.

## 02. Monospaced Data Telemetry

Using JetBrains Mono and Space Grotesk side-by-side establishes a tactile balance between high-end editorial magazines and mission-critical terminal dashboards.

\`\`\`css
/* Custom subtle stroke text outline */
.text-outline-stroke {
  -webkit-text-stroke: 1.5px rgba(245, 245, 245, 0.35);
  color: transparent;
}
\`\`\`

## 03. Conclusion

When design systems harmonize with clean code architecture, the result is a website that stands out, respects user attention, and elevates developer credibility.`,
      published: true,
      publishedAt: new Date("2026-08-31"),
    },
    {
      slug: "fullstack-system-architecture-scalable-web-apps",
      title: "Architecting Full-Stack Scalability with Next.js & Supabase",
      summary:
        "Practical architectural strategies for connection pooling, type-safe ORM schema migrations, and zero-latency global edge caching.",
      readingTime: "6 min read",
      tags: JSON.stringify(["Architecture", "PostgreSQL", "Supabase", "TypeScript"]),
      coverImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
      content: `Modern software development requires balancing high developer velocity with enterprise-grade system resilience.

## 01. Database Connection Pooling Strategy

When deploying serverless microservices on Vercel or Cloudflare Edge, direct connections to PostgreSQL can rapidly exhaust connection limits under heavy spikes.

> Using Transaction Mode PgBouncer pooling on port 6543 solves concurrency limits while retaining direct migration capabilities on port 5432.

### Architecture Highlights:
- **Connection Multiplexing**: Handles thousands of simultaneous read requests with negligible database CPU overhead.
- **Type-Safe ORM**: Prisma Client generates rigorous TypeScript bindings straight from the schema definition.
- **Automated Defensive Fallback**: Graceful caching ensures website uptime even during intermittent upstream maintenance.`,
      published: true,
      publishedAt: new Date("2026-09-01"),
    },
    {
      slug: "tactile-micro-interactions-and-creative-coding",
      title: "The Art of Tactile Micro-Interactions & Custom Cursors",
      summary:
        "How physics-based magnetic attraction, velocity dampening, and custom pointer canvas blending transform ordinary websites into digital art.",
      readingTime: "4 min read",
      tags: JSON.stringify(["Creative Coding", "Framer Motion", "UI Engineering"]),
      coverImage:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1600&auto=format&fit=crop",
      content: `Tactile feedback is what separates an ordinary webpage from an unforgettable digital experience.

## 01. Physics-Based Magnetic Snapping

By tracking the bounding rectangle of interactive interactive elements (\`<MagneticButton />\`), we calculate the distance vector and apply a non-linear spring dampening curve.

\`\`\`ts
// Non-linear spring calculation
const distanceX = clientX - (rect.left + rect.width / 2);
const distanceY = clientY - (rect.top + rect.height / 2);
const pullFactor = 0.35;
\`\`\`

## 02. Summary

Subtle micro-animations convey care, precision, and craftsmanship—attributes that clients and design-conscious companies seek in a top-tier software engineer.`,
      published: true,
      publishedAt: new Date("2026-09-01"),
    },
  ];

  for (const post of initialPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log(`✓ ${initialPosts.length} Initial Articles seeded`);

  // 6. Seed Skills
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

  // 7. Seed Experiments
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
