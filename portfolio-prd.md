# PRD --- Personal Developer Portfolio

## 1. Product Overview

**Product:** Personal Developer Portfolio\
**Type:** Personal portfolio / project showcase\
**Primary goal:** Menampilkan identitas, kemampuan, dan project yang
pernah dibuat secara profesional melalui website yang memiliki visual
kuat, interaktif, dan mudah dinavigasi.

Website tidak diposisikan sebagai CV online biasa. Fokus utama adalah
**project showcase** dan pengalaman visual yang menunjukkan kemampuan
development sekaligus perhatian terhadap UI/UX.

### Design Reference

Arah visual mengacu pada referensi portfolio yang diberikan:

-   Dark editorial layout
-   Asymmetric composition
-   Large typography
-   Outline typography
-   Strong negative space
-   Large project imagery
-   Vertical image slicing
-   Minimal navigation
-   Subtle red accent
-   Scroll-driven animation
-   Premium / experimental developer aesthetic

Desain harus memiliki identitas sendiri dan tidak menyalin layout atau
visual referensi secara langsung.

------------------------------------------------------------------------

# 2. Goals

## Primary Goals

1.  Membuat portfolio pribadi yang terlihat profesional dan memorable.
2.  Menampilkan project sebagai bukti kemampuan, bukan hanya daftar
    teknologi.
3.  Membuat pengalaman browsing yang halus dan interaktif.
4.  Memiliki struktur yang mudah dikembangkan ketika project baru
    ditambahkan.
5.  Memastikan website responsive pada desktop, tablet, dan mobile.
6.  Memiliki performa yang baik meskipun menggunakan animasi dan gambar
    berukuran besar.
7.  Menyediakan halaman detail untuk project utama.

## Secondary Goals

-   Memperkuat personal branding sebagai software developer.
-   Menjadi landing page untuk recruiter/client.
-   Menyediakan link ke GitHub, LinkedIn, email, demo, atau repository
    project.
-   Menjadi tempat eksperimen UI/UX dan interaction design.

------------------------------------------------------------------------

# 3. Non-Goals

Website tidak perlu:

-   Dashboard admin.
-   Database untuk data portfolio pada versi awal.
-   Sistem authentication.
-   CMS.
-   Blog pada MVP.
-   Backend API khusus portfolio.
-   Sistem komentar.
-   Fitur yang tidak memiliki manfaat langsung bagi pengunjung.

Data project untuk MVP disimpan sebagai static data / TypeScript
objects.

------------------------------------------------------------------------

# 4. Target Audience

## Primary

### Recruiter / Hiring Manager

Mereka harus dapat memahami dalam waktu singkat:

-   Siapa pemilik website.
-   Apa keahliannya.
-   Project apa yang pernah dibuat.
-   Teknologi yang digunakan.
-   Bagaimana cara menghubungi pemilik website.

### Potential Client

Mereka harus dapat melihat:

-   Kemampuan development.
-   Project nyata.
-   Jenis pekerjaan yang dapat dibuat.
-   Cara menghubungi developer.

## Secondary

### Developer / Community

Pengunjung yang tertarik dengan:

-   Technical implementation.
-   Open-source project.
-   Experiments.
-   Modding.
-   Tools.

------------------------------------------------------------------------

# 5. Product Principles

## 5.1 Project First

Project merupakan konten utama website.

Jangan membuat section "Skills" lebih besar daripada project.

## 5.2 Visual Before Information Density

Informasi harus mudah dipindai.

Gunakan:

-   Large typography
-   Short descriptions
-   Strong hierarchy
-   Negative space
-   Visual project preview

## 5.3 Minimal Navigation

Navigasi harus sederhana.

Target:

``` text
WORK
ABOUT
CONTACT
```

Tidak menggunakan terlalu banyak menu.

## 5.4 Motion With Purpose

Animasi digunakan untuk:

-   Membantu hierarchy.
-   Memberi feedback.
-   Membuat transisi lebih natural.
-   Membentuk pengalaman visual.

Animasi tidak boleh mengganggu readability atau usability.

## 5.5 Performance First

Animasi dan visual tidak boleh mengorbankan performa.

------------------------------------------------------------------------

# 6. Technology Stack

## Core

-   Next.js
-   TypeScript
-   Tailwind CSS

## Animation

-   GSAP
-   GSAP ScrollTrigger
-   Motion

## Images

-   Next/Image

## Icons

-   Lucide Icons

## Deployment

-   Vercel

------------------------------------------------------------------------

# 7. Technical Architecture

Struktur project yang disarankan:

``` text
portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── work/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   └── about/
│       └── page.tsx
│
├── components/
│   ├── navigation/
│   │   ├── Navbar.tsx
│   │   └── Menu.tsx
│   │
│   ├── hero/
│   │   ├── Hero.tsx
│   │   └── ScrollIndicator.tsx
│   │
│   ├── projects/
│   │   ├── ProjectList.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectImage.tsx
│   │   └── ProjectPreview.tsx
│   │
│   ├── about/
│   │   ├── About.tsx
│   │   └── Skills.tsx
│   │
│   ├── contact/
│   │   └── Contact.tsx
│   │
│   └── ui/
│       ├── MagneticButton.tsx
│       ├── SplitText.tsx
│       └── SectionLabel.tsx
│
├── app/
│   └── admin/
│       ├── login/
│       │   └── page.tsx
│       ├── page.tsx
│       ├── projects/
│       │   ├── page.tsx
│       │   ├── new/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── profile/
│       │   └── page.tsx
│       └── settings/
│           └── page.tsx
│
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── ProjectForm.tsx
│       ├── MediaUploader.tsx
│       └── AdminHeader.tsx
│
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── projects/
│   │   ├── enterprise/
│   │   ├── kasir/
│   │   ├── clipping/
│   │   └── other/
│   │
│   └── images/
│
├── lib/
│   └── utils.ts
│
└── package.json
```

> Struktur di atas menggambarkan arsitektur utama. Folder `app/admin` dan komponen admin berada dalam aplikasi Next.js yang sama, tetapi seluruh route admin harus dilindungi authentication.

------------------------------------------------------------------------

# 8. Information Architecture

``` text
Home
│
├── Hero
│
├── Selected Works
│   ├── Project 01
│   ├── Project 02
│   ├── Project 03
│   └── Project 04
│
├── About
│
├── Skills / Capabilities
│
├── Experiments
│
└── Contact

Project Detail
│
├── Project Header
├── Hero Image
├── Overview
├── Features
├── Technology
├── Development Details
├── Gallery
└── Links
```

------------------------------------------------------------------------

# 9. Homepage UX

## 9.1 Navbar

Navbar bersifat minimal dan dapat dibuat sticky.

### Content

``` text
[BOS / LOGO]

WORK
ABOUT
CONTACT
```

### Behavior

-   Transparent pada awal halaman.
-   Tetap terlihat ketika scrolling jika tidak mengganggu desain.
-   Mobile menggunakan menu button.
-   Menu mobile menggunakan Motion untuk transition.

------------------------------------------------------------------------

# 10. Hero Section

Hero merupakan visual utama website.

### Content

``` text
SOFTWARE DEVELOPER

BOS

I BUILD
DIGITAL THINGS.
```

Alternative headline dapat digunakan sesuai personal branding.

### Visual

-   Giant typography.
-   Outline typography sebagai decorative layer.
-   Small metadata.
-   Decorative red line.
-   Minimal scroll indicator.
-   Asymmetric positioning.

### Animation

Saat halaman pertama kali dibuka:

1.  Background muncul.
2.  Small label fade in.
3.  Nama masuk dengan clip/reveal.
4.  Outline text bergerak sedikit berbeda dari primary text.
5.  Decorative line dianimasikan.
6.  Scroll indicator muncul terakhir.

Animation harus cepat dan tidak menghambat user.

------------------------------------------------------------------------

# 11. Selected Works

Section utama website.

Label:

``` text
WORKS_
```

Setiap project memiliki nomor:

``` text
01
02
03
04
```

## Layout

Project menggunakan asymmetric layout.

Contoh:

``` text
01

                [PROJECT IMAGE]

        ENTERPRISE
        GTA V BUSINESS MOD
```

Project berikutnya dapat berpindah ke sisi berlawanan:

``` text
                         02

        [PROJECT IMAGE]

                         KASIR
                         POS SYSTEM
```

Tujuan layout adalah menciptakan rhythm ketika user melakukan scrolling.

------------------------------------------------------------------------

# 12. Project Card / Preview

Project preview tidak menggunakan card grid standar.

### Content

-   Project number.
-   Project title.
-   Short description.
-   Category.
-   Technology.
-   Year.
-   Project image.
-   CTA.

Contoh:

``` text
01

ENTERPRISE

GTA V Business Management Mod

C# · .NET · GTA V

2026

VIEW PROJECT →
```

### Interaction

Ketika hover:

-   Image sedikit scale.
-   Image movement/parallax ringan.
-   Typography berubah posisi secara subtle.
-   CTA muncul atau berubah.
-   Cursor dapat berubah menjadi `VIEW`.

Tidak boleh menggunakan efek yang berlebihan.

------------------------------------------------------------------------

# 13. Project Image Treatment

Project image menjadi bagian penting dari UI.

Untuk beberapa project, screenshot dapat dibuat dalam vertical slices.

Contoh:

``` text
┌────┐ ┌────┐ ┌────┐ ┌────┐
│    │ │    │ │    │ │    │
│IMG │ │IMG │ │IMG │ │IMG │
│    │ │    │ │    │ │    │
└────┘ └────┘ └────┘ └────┘
```

### Animation

Saat masuk viewport:

-   Slice muncul secara staggered.
-   Setiap slice memiliki movement kecil.
-   Saat hover, image dapat melakukan scale/parallax.

GSAP + ScrollTrigger digunakan untuk animation yang terhubung dengan
scroll.

------------------------------------------------------------------------

# 14. Project Detail Page

Route:

``` text
/work/[slug]
```

Contoh:

``` text
/work/enterprise
/work/kasir
/work/clipping
```

## Header

``` text
ENTERPRISE

GTA V BUSINESS
MANAGEMENT MOD

2026
```

## Overview

Penjelasan singkat mengenai project:

-   Masalah / kebutuhan.
-   Tujuan.
-   Solusi.
-   Peran developer.

## Technology

``` text
C#
.NET
GTA V
JavaScript
```

## Features

Daftar fitur utama.

## Gallery

Screenshot dalam ukuran besar.

## Development Details

Jika relevan, jelaskan:

-   Architecture.
-   Technical challenge.
-   Interesting implementation.
-   Performance consideration.

## CTA

``` text
GITHUB →
LIVE DEMO →
```

Link hanya ditampilkan jika tersedia.

------------------------------------------------------------------------

# 15. About Section

About tidak dibuat seperti resume panjang.

### Content

``` text
ABOUT_

I'm a software developer focused on
building web applications, software,
tools and interactive projects.
```

Kemudian informasi tambahan:

-   Background.
-   Education.
-   Area of interest.
-   Current focus.

Gunakan paragraph pendek.

------------------------------------------------------------------------

# 16. Skills / Capabilities

Skills ditampilkan berdasarkan kategori, bukan kumpulan logo.

Contoh:

``` text
WEB
Next.js
React
TypeScript
JavaScript
PHP
Laravel

SOFTWARE
C#
Python
.NET

TOOLS
Git
Linux
Docker

OTHER
Game Modding
Automation
System Tools
```

Jangan menampilkan skill hanya sebagai progress bar.

Contoh yang dihindari:

``` text
JavaScript █████████░ 90%
```

Progress bar tidak memberikan informasi objektif tentang kemampuan
seseorang.

------------------------------------------------------------------------

# 17. Experiments

Section untuk project kecil dan eksperimen.

Contoh:

``` text
EXPERIMENTS_

Photo Metadata Analyzer
Video Clipping Tool
Game Mod Experiments
Automation Tools
```

Section ini memungkinkan project yang lebih kecil tetap mendapatkan
tempat tanpa mengganggu Selected Works.

------------------------------------------------------------------------

# 18. Contact Section

Contact dibuat sebagai closing statement besar.

``` text
HAVE A PROJECT
IN MIND?

LET'S TALK.
```

Links:

``` text
EMAIL
GITHUB
LINKEDIN
```

CTA harus jelas.

------------------------------------------------------------------------

# 19. Visual Design System

## Color

Primary background:

``` text
#0A0A0A
```

Primary text:

``` text
#F5F5F5
```

Secondary text:

``` text
#777777
```

Accent:

``` text
#E31B23
```

Accent hanya digunakan untuk elemen tertentu:

-   Decorative line.
-   Small marker.
-   Hover state.
-   Important metadata.
-   Selected state.

Jangan menggunakan accent pada seluruh UI.

------------------------------------------------------------------------

# 20. Typography

Typography harus menjadi elemen visual utama.

### Display

Karakteristik:

-   Bold.
-   Condensed atau geometric.
-   Large scale.
-   Tight line height.

Font kandidat:

-   Space Grotesk
-   Sora
-   Archivo

### Body

Font kandidat:

-   Inter
-   Manrope

### Scale

Desktop:

``` text
Hero:      80–160px
H1:        64–96px
H2:        48–64px
Body:      16–20px
Metadata:  11–14px
```

Gunakan responsive typography menggunakan `clamp()`.

Contoh:

``` css
font-size: clamp(4rem, 10vw, 10rem);
```

------------------------------------------------------------------------

# 21. Grid System

Desktop:

``` text
12-column grid
```

Layout harus mendukung asymmetric positioning.

Mobile:

``` text
4-column grid
```

Tablet:

``` text
8-column grid
```

Spacing menggunakan scale yang konsisten.

------------------------------------------------------------------------

# 22. Animation System

## GSAP

Digunakan untuk:

-   Hero timeline.
-   ScrollTrigger.
-   Image reveal.
-   Project transitions.
-   Parallax.
-   Pinning.
-   Horizontal scrolling.
-   Large typography movement.

## Motion

Digunakan untuk:

-   Menu transition.
-   Hover interaction.
-   Button interaction.
-   Small UI transitions.
-   Modal/menu animation.

## Animation Rules

-   Animasi harus terasa cepat dan intentional.
-   Hindari animasi terus-menerus tanpa interaksi.
-   Hindari excessive parallax.
-   Jangan membuat text sulit dibaca.
-   Respect `prefers-reduced-motion`.

------------------------------------------------------------------------

# 23. Cursor Interaction

Desktop dapat menggunakan custom cursor sederhana.

States:

``` text
DEFAULT
VIEW
DRAG
LINK
```

Contoh saat hover project:

``` text
VIEW
PROJECT
```

Custom cursor tidak digunakan pada mobile.

------------------------------------------------------------------------

# 24. Responsive Design

## Desktop

Fokus utama:

-   Large typography.
-   Asymmetric layout.
-   Project image besar.
-   Scroll animation.

## Tablet

-   Kurangi ukuran typography.
-   Kurangi movement.
-   Pertahankan asymmetric layout jika memungkinkan.

## Mobile

Layout menjadi lebih linear:

``` text
01
PROJECT IMAGE
PROJECT TITLE
DESCRIPTION
CTA

02
PROJECT IMAGE
PROJECT TITLE
DESCRIPTION
CTA
```

Animation harus dikurangi.

Custom cursor dinonaktifkan.

------------------------------------------------------------------------

# 25. Accessibility

Requirements:

-   Semantic HTML.
-   Keyboard navigation.
-   Visible focus state.
-   Alt text pada image.
-   Sufficient color contrast.
-   Reduced-motion support.
-   Interactive element harus dapat diakses keyboard.
-   Jangan menggunakan animation sebagai satu-satunya cara menyampaikan
    informasi.

------------------------------------------------------------------------

# 26. Performance Requirements

Target:

-   Fast initial load.
-   Optimized images.
-   Lazy loading untuk image yang tidak berada di initial viewport.
-   Hindari JavaScript yang tidak diperlukan.
-   Gunakan dynamic import untuk komponen animation berat jika
    diperlukan.
-   Hindari layout shift.
-   Jangan menjalankan animation ketika element tidak terlihat.

Target Lighthouse:

``` text
Performance: 90+
Accessibility: 90+
Best Practices: 90+
SEO: 90+
```

Target tersebut merupakan goal, bukan alasan untuk mengorbankan UX demi
mengejar angka Lighthouse.

------------------------------------------------------------------------

# 27. SEO

Homepage harus memiliki:

-   Title.
-   Meta description.
-   Open Graph metadata.
-   Twitter/X metadata.
-   Favicon.
-   Semantic headings.
-   Descriptive URLs.

Project detail harus memiliki metadata berdasarkan project.

Contoh:

``` text
Title:
Enterprise — GTA V Business Management Mod | Bos

Description:
A GTA V business management mod built with C# and .NET.
```

------------------------------------------------------------------------

# 28. Data Model

Project disimpan dalam TypeScript.

Contoh struktur:

``` ts
export interface Project {
  slug: string;
  number: string;
  title: string;
  description: string;
  category: string;
  year: number;
  technologies: string[];
  thumbnail: string;
  images: string[];
  featured?: boolean;
  github?: string;
  demo?: string;
}
```

Contoh:

``` ts
{
  slug: "enterprise",
  number: "01",
  title: "Enterprise",
  description: "GTA V business management mod.",
  category: "Game Modding",
  year: 2026,
  technologies: ["C#", ".NET", "GTA V"],
  thumbnail: "/projects/enterprise/thumbnail.webp",
  images: [
    "/projects/enterprise/01.webp",
    "/projects/enterprise/02.webp"
  ],
  featured: true
}
```

------------------------------------------------------------------------

# 29. Admin Portal

Admin portal merupakan bagian resmi dari produk.

Route dasar:

```text
/admin
/admin/login
/admin/projects
/admin/projects/new
/admin/projects/[id]
/admin/profile
/admin/settings
```

## 29.1 Dashboard

Dashboard menampilkan ringkasan:

- Total project.
- Published project.
- Draft project.
- Project terbaru.
- Quick action untuk membuat project.

## 29.2 Project Management

Admin dapat:

- Membuat project.
- Mengedit project.
- Menghapus project.
- Menyimpan draft.
- Publish / unpublish project.
- Menentukan featured project.
- Mengatur nomor/urutan project.
- Mengubah slug.
- Mengatur technology.
- Menambahkan GitHub URL.
- Menambahkan demo URL.
- Mengunggah thumbnail.
- Mengunggah gallery image.
- Mengubah urutan gambar.

## 29.3 Profile Management

Admin dapat mengubah:

- Nama.
- Job title.
- Bio.
- Email.
- Social links.
- Informasi pendidikan.
- Informasi personal yang memang ingin ditampilkan.

## 29.4 Skills Management

Admin dapat:

- Menambah skill.
- Menghapus skill.
- Mengubah kategori.
- Mengatur urutan.
- Menyembunyikan skill.

## 29.5 Media Management

Media upload harus:

- Memvalidasi tipe file.
- Memvalidasi ukuran.
- Menghasilkan URL yang aman.
- Menyimpan metadata.
- Mendukung reorder gallery.
- Menghindari nama file yang bentrok.

## 29.6 Authentication

Admin portal harus membutuhkan authentication.

Minimum:

- Email + password atau provider authentication.
- Protected admin routes.
- Session management.
- Logout.
- Server-side authorization.

Hanya user dengan role `ADMIN` yang dapat mengakses halaman administrasi.

## 29.7 Security

- Password tidak pernah disimpan dalam plaintext.
- Validasi input dilakukan server-side.
- Authorization dilakukan pada server, bukan hanya menyembunyikan UI.
- Upload file divalidasi.
- URL eksternal divalidasi sesuai kebutuhan.
- Secret dan credential disimpan melalui environment variables.
- Endpoint mutation tidak boleh dapat diakses oleh anonymous user.

## 29.8 Publishing Flow

```text
CREATE
  ↓
DRAFT
  ↓
PREVIEW
  ↓
PUBLISH
  ↓
PUBLIC WEBSITE
```

Admin dapat mengedit project yang sudah published dan menyimpan perubahan sebelum publish jika diperlukan.

---

# 36. Content Requirements

Minimum MVP:

### Personal

-   Nama.
-   Job title.
-   Short introduction.
-   About.
-   Education.
-   Skills.

### Projects

Minimal 3 project utama.

Setiap project minimal memiliki:

-   Name.
-   Description.
-   Year.
-   Technology.
-   Screenshot.
-   Detail page.

### Contact

-   Email.
-   GitHub.
-   LinkedIn atau social profile yang relevan.

------------------------------------------------------------------------

# 36. MVP Scope

## Included

-   Homepage.
-   Hero.
-   Navbar.
-   Selected Works.
-   Project detail.
-   About.
-   Skills.
-   Experiments.
-   Contact.
-   Responsive layout.
-   GSAP animation.
-   Motion interaction.
-   Next/Image.
-   SEO metadata.
-   Accessibility dasar.

## Excluded

-   Blog.
-   CMS.
-   Authentication.
-   Admin dashboard.
-   Database.
-   Analytics kompleks.
-   Contact form backend.

------------------------------------------------------------------------

# 36. Development Phases

## Phase 1 --- Foundation

-   Setup Next.js.
-   TypeScript.
-   Tailwind CSS.
-   ESLint.
-   Folder structure.
-   Global CSS.
-   Font setup.
-   Color variables.

## Phase 2 --- UI Foundation

-   Navbar.
-   Typography.
-   Grid.
-   Section labels.
-   Buttons.
-   Project component.

## Phase 3 --- Homepage

-   Hero.
-   Works.
-   About.
-   Skills.
-   Experiments.
-   Contact.

## Phase 4 --- Project Detail

-   Dynamic route.
-   Project data.
-   Gallery.
-   Technical details.
-   CTA.

## Phase 5 --- Animation

-   Hero entrance.
-   Scroll reveal.
-   Project image animation.
-   Typography animation.
-   Hover interaction.
-   Page transition.

## Phase 6 --- Responsive

-   Tablet.
-   Mobile.
-   Touch interaction.
-   Reduce animation on small screens.

## Phase 7 --- Optimization

-   Image optimization.
-   Lazy loading.
-   Bundle review.
-   Accessibility.
-   SEO.
-   Lighthouse audit.

## Phase 8 --- Deployment

-   Git repository.
-   Production build.
-   Vercel deployment.
-   Custom domain.
-   Final testing.

------------------------------------------------------------------------

# 36. Acceptance Criteria

Website dianggap siap MVP apabila:

-   [ ] Homepage dapat dibuka tanpa error.
-   [ ] Semua project utama dapat diakses.
-   [ ] Project detail memiliki route yang benar.
-   [ ] Website responsive.
-   [ ] Navigation berfungsi.
-   [ ] Semua external link valid.
-   [ ] Image menggunakan Next/Image jika sesuai.
-   [ ] Tidak ada horizontal overflow yang tidak disengaja.
-   [ ] Animation tidak mengganggu readability.
-   [ ] Reduced-motion tersedia.
-   [ ] Keyboard navigation dapat digunakan.
-   [ ] Metadata SEO tersedia.
-   [ ] Lighthouse mencapai target yang ditentukan.
-   [ ] Production build berhasil.
-   [ ] Tidak ada console error pada production.

------------------------------------------------------------------------

# 36. Definition of Done

Sebuah fitur dianggap selesai apabila:

1.  UI sudah sesuai design system.
2.  Responsive pada desktop, tablet, dan mobile.
3.  Interaction sudah berfungsi.
4.  Tidak menimbulkan console error.
5.  Tidak menyebabkan layout shift yang signifikan.
6.  Accessible secara dasar.
7.  Sudah diuji pada browser modern.
8.  Tidak menurunkan performa secara signifikan.

------------------------------------------------------------------------

# 36. Final Design Direction

Arah final portfolio:

``` text
DARK
+
EDITORIAL
+
ASYMMETRIC
+
GIANT TYPOGRAPHY
+
OUTLINE TEXT
+
LARGE PROJECT VISUALS
+
RED ACCENT
+
SUBTLE INTERACTION
+
SCROLL-DRIVEN ANIMATION
```

Portfolio harus terasa seperti **personal developer studio**, bukan
template CV online.

Prioritas desain:

``` text
1. Project presentation
2. Typography
3. Layout composition
4. Interaction
5. Animation
6. Supporting information
```

Prinsip utama:

> **Show what you build, not just what you know.**
