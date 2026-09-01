import { Navbar } from "@/components/navigation/Navbar";
import { Hero } from "@/components/hero/Hero";
import { ProjectList } from "@/components/projects/ProjectList";
import { AboutSection } from "@/components/about/AboutSection";
import { SkillsSection } from "@/components/about/SkillsSection";
import { BlogSection } from "@/components/blog/BlogSection";
import { ExperimentsSection } from "@/components/experiments/ExperimentsSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/footer/Footer";

import { getStore } from "@/lib/storage";

// Force dynamic rendering so updates in admin portal reflect immediately
export const dynamic = "force-dynamic";

export default async function Home() {
  const store = await getStore();
  const projects = store.projects.filter((p) => p.published !== false);
  const posts = store.posts || [];
  const profile = store.profile;
  const skills = store.skills;
  const experiments = store.experiments;

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[#E31B23] selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <Hero resumeUrl={profile.resumeUrl} />
        <AboutSection profile={profile} />
        <ProjectList projects={projects} />
        <SkillsSection categories={skills} />
        <BlogSection posts={posts} />
        <ExperimentsSection experiments={experiments} />
        <ContactSection profile={profile} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
