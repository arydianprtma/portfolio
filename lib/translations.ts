export type Language = "en" | "id";

export interface Translations {
  // Navigation
  nav: {
    about: string;
    work: string;
    skills: string;
    blog: string;
    experiments: string;
    contact: string;
    search: string;
    letsTalk: string;
  };

  // Hero Section
  hero: {
    availableForHire: string;
    softwareDeveloper: string;
    creativeEngineer: string;
    systemsArchitect: string;
    description: string;
    exploreWorks: string;
    downloadCv: string;
    scrollDown: string;
  };

  // About Section
  about: {
    sectionLabel: string;
    whoAmI: string;
    downloadResume: string;
    bio1: string;
    bio2: string;
    philosophy1Title: string;
    philosophy1Desc: string;
    philosophy2Title: string;
    philosophy2Desc: string;
    philosophy3Title: string;
    philosophy3Desc: string;
  };

  // Projects Section
  projects: {
    sectionLabel: string;
    headline: string;
    description: string;
    viewProject: string;
    liveDemo: string;
    sourceCode: string;
    featured: string;
    allProjects: string;
  };

  // Skills Section
  skills: {
    sectionLabel: string;
    headline: string;
    description: string;
  };

  // Blog Section
  blog: {
    sectionLabel: string;
    headline: string;
    description: string;
    readArticle: string;
    viewAll: string;
    tableOfContents: string;
    writtenBy: string;
    backToAll: string;
  };

  // Experiments Section
  experiments: {
    sectionLabel: string;
    headline: string;
    description: string;
    viewPrototype: string;
  };

  // Contact Section
  contact: {
    sectionLabel: string;
    headlinePart1: string;
    headlinePart2: string;
    headlinePart3: string;
    description: string;
    directInquiry: string;
    encryptedNotice: string;
    yourName: string;
    emailAddress: string;
    topicService: string;
    budgetScope: string;
    yourMessage: string;
    messagePlaceholder: string;
    transmitting: string;
    sendInquiry: string;
    successTitle: string;
    successDesc: string;
    availableForHireBadge: string;
    directEmailDispatch: string;
    downloadCvBadge: string;
    githubProfile: string;
    linkedinProfile: string;
    twitterProfile: string;
  };

  // Command Palette
  palette: {
    searchPlaceholder: string;
    noCommandsFound: string;
    downloadCvTitle: string;
    downloadCvDesc: string;
    copyEmailTitle: string;
    emailCopiedTitle: string;
    switchLangTitle: string;
    switchLangDesc: string;
    quickNav: string;
    actions: string;
    projects: string;
    articles: string;
    activeNotice: string;
  };

  // Footer
  footer: {
    backToTop: string;
    allRightsReserved: string;
    designedEngineered: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      about: "ABOUT",
      work: "WORK",
      skills: "SKILLS",
      blog: "BLOG",
      experiments: "EXPERIMENTS",
      contact: "CONTACT",
      search: "SEARCH",
      letsTalk: "LET'S TALK",
    },
    hero: {
      availableForHire: "AVAILABLE FOR HIRE",
      softwareDeveloper: "WEBSITE DEVELOPER",
      creativeEngineer: "INTERACTIVE ENGINEER",
      systemsArchitect: "DIGITAL CRAFTSMAN",
      description:
        "Specializing in high-performance web applications, specialized system software, and immersive interactive digital experiences.",
      exploreWorks: "EXPLORE WORKS",
      downloadCv: "DOWNLOAD CV",
      scrollDown: "SCROLL TO EXPLORE",
    },
    about: {
      sectionLabel: "01 / IDENTITY & PHILOSOPHY",
      whoAmI: "WHO AM I",
      downloadResume: "DOWNLOAD CV / RESUME",
      bio1:
        "I am a Website Developer focused on engineering high-performance web applications and crafting immersive, interactive digital experiences. I prioritize access speed, system stability, and clean code architecture in every solution I build.",
      bio2:
        "My approach combines technical precision with aesthetic refinement. I believe software should not merely function—it must respond instantly, feel intuitive, and leave a lasting impression.",
      philosophy1Title: "01 / ARCHITECTURE",
      philosophy1Desc: "Clean modular abstractions with minimal overhead.",
      philosophy2Title: "02 / INTERACTION",
      philosophy2Desc: "Purposeful 60+ FPS motion without compromising speed.",
      philosophy3Title: "03 / PRECISION",
      philosophy3Desc: "High attention to UI details and native telemetry.",
    },
    projects: {
      sectionLabel: "02 / SELECTED WORKS",
      headline: "FEATURED PROJECTS",
      description:
        "Production-grade web systems, high-concurrency applications, and custom frameworks.",
      viewProject: "VIEW PROJECT",
      liveDemo: "LIVE DEMO",
      sourceCode: "SOURCE CODE",
      featured: "FEATURED",
      allProjects: "ALL PROJECTS",
    },
    skills: {
      sectionLabel: "03 / TECHNICAL STACK",
      headline: "CAPABILITIES & TOOLS",
      description:
        "Modern development stack calibrated for speed, type safety, and scalability.",
    },
    blog: {
      sectionLabel: "04 / TECH INSIGHTS & ARTICLES",
      headline: "WRITING & ARCHITECTURE",
      description:
        "Technical deep-dives, performance benchmarks, and software engineering methodologies.",
      readArticle: "READ ARTICLE",
      viewAll: "VIEW ALL ARTICLES",
      tableOfContents: "TABLE OF CONTENTS",
      writtenBy: "WRITTEN BY",
      backToAll: "BACK TO ALL ARTICLES",
    },
    experiments: {
      sectionLabel: "05 / EXPERIMENTS LAB",
      headline: "CREATIVE & PROTOTYPES",
      description: "Exploratory creative coding, shaders, and micro-tools.",
      viewPrototype: "VIEW EXPERIMENT",
    },
    contact: {
      sectionLabel: "06 / CONTACT & INQUIRIES",
      headlinePart1: "HAVE A PROJECT",
      headlinePart2: "IN MIND?",
      headlinePart3: "LET'S TALK.",
      description:
        "I am currently open to consulting, contract work, high-impact development roles, or custom systems engineering projects.",
      directInquiry: "SEND DIRECT INQUIRY",
      encryptedNotice: "100% ENCRYPTED & LOGGED",
      yourName: "YOUR NAME *",
      emailAddress: "EMAIL ADDRESS *",
      topicService: "PROJECT TOPIC / SERVICE",
      budgetScope: "ESTIMATED BUDGET / SCOPE",
      yourMessage: "YOUR MESSAGE *",
      messagePlaceholder:
        "Tell me about your project goals, timeline, or requirements...",
      transmitting: "TRANSMITTING INQUIRY...",
      sendInquiry: "SEND INQUIRY",
      successTitle: "Thank you! Your message has been sent.",
      successDesc:
        "I will review your inquiry and respond to your email as soon as possible.",
      availableForHireBadge: "AVAILABLE FOR HIRE",
      directEmailDispatch: "DIRECT EMAIL DISPATCH",
      downloadCvBadge: "DOWNLOAD CURRICULUM VITAE",
      githubProfile: "GITHUB PROFILE",
      linkedinProfile: "LINKEDIN PROFILE",
      twitterProfile: "TWITTER / X",
    },
    palette: {
      searchPlaceholder: "Search commands, projects, articles, cv...",
      noCommandsFound: "No matching commands found",
      downloadCvTitle: "Download CV / Resume (PDF)",
      downloadCvDesc: "Instant download verified resume",
      copyEmailTitle: "Copy Email Address",
      emailCopiedTitle: "Email Copied to Clipboard!",
      switchLangTitle: "Ganti Bahasa ke Indonesia",
      switchLangDesc: "Switch interface language to Bahasa Indonesia (ID)",
      quickNav: "Navigation",
      actions: "Action",
      projects: "Projects",
      articles: "Articles",
      activeNotice: "COMMAND PALETTE ACTIVE",
    },
    footer: {
      backToTop: "BACK TO TOP",
      allRightsReserved: "ALL RIGHTS RESERVED.",
      designedEngineered: "DESIGNED & ENGINEERED WITH PRECISION",
    },
  },

  id: {
    nav: {
      about: "TENTANG",
      work: "PROYEK",
      skills: "KEAHLIAN",
      blog: "ARTIKEL",
      experiments: "EKSPERIMEN",
      contact: "KONTAK",
      search: "CARI",
      letsTalk: "HUBUNGI SAYA",
    },
    hero: {
      availableForHire: "TERSEDIA UNTUK PROYEK",
      softwareDeveloper: "PENGEMBANG WEB",
      creativeEngineer: "PENGEMBANG INTERAKTIF",
      systemsArchitect: "ARSITEK DIGITAL",
      description:
        "Spesialis dalam pengembangan aplikasi web performa tinggi, sistem perangkat lunak terpadu, dan pengalaman digital interaktif imersif.",
      exploreWorks: "LIHAT PROYEK",
      downloadCv: "UNDUH CV",
      scrollDown: "GULIR KE BAWAH",
    },
    about: {
      sectionLabel: "01 / IDENTITAS & FILOSOFI",
      whoAmI: "TENTANG SAYA",
      downloadResume: "UNDUH CV / RESUME",
      bio1:
        "Saya adalah seorang Website Developer dengan fokus pada pengembangan aplikasi web berkinerja tinggi serta penciptaan pengalaman digital yang imersif dan interaktif. Saya mengutamakan kecepatan akses, stabilitas sistem, dan arsitektur kode yang bersih dalam setiap solusi yang saya bangun.",
      bio2:
        "Bagi saya, website bukan sekadar kumpulan kode fungsional, melainkan sebuah platform digital yang harus memberikan kesan mendalam, responsivitas tinggi, dan kemudahan bagi setiap pengguna.",
      philosophy1Title: "01 / ARSITEKTUR",
      philosophy1Desc: "Abstraksi kode modular bersih dengan beban komputasi rendah.",
      philosophy2Title: "02 / INTERAKSI",
      philosophy2Desc: "Animasi mulus 60+ FPS tanpa mengorbankan kecepatan akses.",
      philosophy3Title: "03 / PRESISI",
      philosophy3Desc: "Perhatian tinggi pada detail visual dan telemetri data.",
    },
    projects: {
      sectionLabel: "02 / KARYA PILIHAN",
      headline: "PROYEK UNGGULAN",
      description:
        "Sistem web level produksi, aplikasi konkurensi tinggi, dan kerangka kerja kustom.",
      viewProject: "LIHAT PROYEK",
      liveDemo: "LIVE DEMO",
      sourceCode: "KODE SUMBER",
      featured: "UNGGULAN",
      allProjects: "SEMUA PROYEK",
    },
    skills: {
      sectionLabel: "03 / TUMPANG TINDIH TEKNOLOGI",
      headline: "KEAHLIAN & ALAT",
      description:
        "Teknologi modern yang dikalibrasi untuk kecepatan, keamanan tipe, dan skalabilitas.",
    },
    blog: {
      sectionLabel: "04 / WAWASAN & ARTIKEL TEKNIS",
      headline: "TULISAN & ARSITEKTUR",
      description:
        "Kajian teknis mendalam, tolok ukur performa, dan metodologi rekayasa perangkat lunak.",
      readArticle: "BACA ARTIKEL",
      viewAll: "SEMUA ARTIKEL",
      tableOfContents: "DAFTAR ISI",
      writtenBy: "DITULIS OLEH",
      backToAll: "KEMBALI KE SEMUA ARTIKEL",
    },
    experiments: {
      sectionLabel: "05 / LAB EKSPERIMEN",
      headline: "KREATIF & PROTOTIPE",
      description: "Eksplorasi creative coding, shader grafis, dan alat mikro.",
      viewPrototype: "LIHAT EKSPERIMEN",
    },
    contact: {
      sectionLabel: "06 / KONTAK & DISKUSI",
      headlinePart1: "PUNYA IDE",
      headlinePart2: "PROYEK?",
      headlinePart3: "MARI BICARA.",
      description:
        "Saya terbuka untuk konsultasi, kerja kontrak, posisi pengembangan berdampak tinggi, atau pembuatan sistem kustom.",
      directInquiry: "KIRIM PESAN LANGSUNG",
      encryptedNotice: "100% TERENKRIPSI & TERCATAT",
      yourName: "NAMA ANDA *",
      emailAddress: "ALAMAT EMAIL *",
      topicService: "TOPIK / LAYANAN PROYEK",
      budgetScope: "PERKIRAAN BUDGET / SKALA",
      yourMessage: "PESAN ANDA *",
      messagePlaceholder:
        "Ceritakan tentang tujuan proyek, tenggat waktu, atau kebutuhan Anda...",
      transmitting: "MENGIRIMKAN PESAN...",
      sendInquiry: "KIRIM PESAN",
      successTitle: "Terima kasih! Pesan Anda telah terkirim.",
      successDesc:
        "Saya akan meninjau pesan Anda dan segera membalasnya ke alamat email Anda.",
      availableForHireBadge: "TERSEDIA UNTUK PROYEK",
      directEmailDispatch: "EMAIL DISPATCH LANGSUNG",
      downloadCvBadge: "UNDUH CURRICULUM VITAE",
      githubProfile: "PROFIL GITHUB",
      linkedinProfile: "PROFIL LINKEDIN",
      twitterProfile: "TWITTER / X",
    },
    palette: {
      searchPlaceholder: "Cari perintah, proyek, artikel, cv...",
      noCommandsFound: "Tidak ada perintah yang cocok",
      downloadCvTitle: "Unduh CV / Resume (PDF)",
      downloadCvDesc: "Unduh instan resume terverifikasi",
      copyEmailTitle: "Salin Alamat Email",
      emailCopiedTitle: "Email Berhasil Disalin!",
      switchLangTitle: "Switch Language to English",
      switchLangDesc: "Ubah bahasa antarmuka ke Bahasa Inggris (EN)",
      quickNav: "Navigasi",
      actions: "Aksi",
      projects: "Proyek",
      articles: "Artikel",
      activeNotice: "COMMAND PALETTE AKTIF",
    },
    footer: {
      backToTop: "KEMBALI KE ATAS",
      allRightsReserved: "HAK CIPTA DILINDUNGI.",
      designedEngineered: "DIRANCANG & DIKEMBANGKAN DENGAN PRESISI",
    },
  },
};
