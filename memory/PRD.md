# ORBYA Portfolio - Product Requirements Document

## Original Problem Statement
Build a high-end, multi-page portfolio website for video editor/motion designer "Shrunit Shirke" (brand name: ORBYA) with an "Iron Man HUD" aesthetic.

## Core Requirements
- **Visual Theme:** Pure black background (#000000), glowing orange (#FF4D00) accents, minimalist, cinematic, industrial style
- **Pages:** Home, Work (The Vault), Skills (Technical Specs), Contact (Comms)
- **Content:** Dynamic projects, skills, quotes fetched from backend JSON files
- **Custom Cursor:** Arc reactor-inspired cursor with smooth motion trail
- **Animations:** HUD-style entrance animations, hover effects
- **Fully Customizable:** Everything editable via JSON files or API - no code changes needed

## User Personas
- Primary: Potential clients (film studios, content creators) looking to hire a video editor
- Secondary: Recruiters reviewing portfolio

## Architecture
```
/app/
├── backend/ (FastAPI)
│   ├── data/
│   │   ├── projects.json       # Dynamic project data (supports multiple aspect ratios)
│   │   ├── skills.json         # Dynamic skills data (auto-groups by category)
│   │   ├── quotes.json         # Quote of the day pool
│   │   ├── stats.json          # Portfolio statistics (customizable)
│   │   └── CUSTOMIZATION_GUIDE.md
│   ├── static/
│   │   └── ORBYA_Resume.pdf
│   └── server.py               # API endpoints (full CRUD)
└── frontend/ (React)
    ├── components/
    │   ├── ReticleCursor.js    # Custom cursor
    │   ├── GlitchText.js       # Text animation
    │   ├── ProjectCard.js      # Project display (supports multiple aspect ratios)
    │   └── SkillBar.js         # Skill progress bar
    └── pages/
        ├── Home.js             # HUD data displays, rotating rings
        ├── Work.js             # Video modal, category filters, view modes
        ├── Skills.js           # Auto-grouping categories, dynamic stats
        └── Contact.js
```

## API Endpoints
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Add new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/sync` - Sync JSON to MongoDB
- `GET /api/skills` - Fetch all skills
- `POST /api/skills` - Add new skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill
- `POST /api/skills/sync` - Sync JSON to MongoDB
- `GET /api/stats` - Get portfolio stats
- `PUT /api/stats` - Update portfolio stats
- `GET /api/quote` - Random quote
- `POST /api/contact` - Contact form submission
- `GET /api/resume/download` - Download resume

## What's Been Implemented (Dec 2025)

### ✅ Completed Features

**Home Page:**
- Live system time display (SYS_TIME)
- Rotating arc reactor rings around title
- Status indicators (ONLINE, LOCATION, VERSION)
- Availability badges (AVAILABLE/FREELANCE)
- Mission Briefing with featured project
- Quote of the day

**Work Page (The Vault):**
- Dynamic category filters (auto-detected from projects)
- Stats bar (project count, categories, year range)
- Masonry layout for mixed aspect ratios
- Grid view option
- Video modal player (supports YouTube, Vimeo, direct URLs)
- Featured/year badges
- Tags display

**Skills Page (Technical Specs):**
- Auto-grouping by category
- Dynamic column layout (1-3 columns based on categories)
- Skill count per category
- Customizable stats section
- Resume download

**Contact Page:**
- Form submission to MongoDB
- Social links
- Response protocol info
- Availability status

**Global Features:**
- Custom arc reactor cursor with motion trail
- Decorative corner brackets on all pages
- HUD-style animations
- Responsive design
- Full CRUD API for all content

### ⚠️ Mocked/Simplified
- Contact form logs to console (no email integration)

## Dynamic Content System

### Aspect Ratios Supported
- `16:9` / `landscape` - Standard widescreen
- `9:16` / `vertical` - Instagram/TikTok
- `1:1` / `square` - Square format
- `4:3` - Classic TV
- `21:9` / `ultrawide` - Cinematic

### Skill Categories (Auto-Detected)
- `software` → CPU icon
- `creative` → Sparkles icon
- `tools` → Wrench icon
- `design` → Palette icon
- `development` → Code icon

## Backlog

### P1 (High Priority)
- [ ] Implement "Glitch" page transitions
- [ ] Implement "Decode" text entrance animations
- [ ] Email integration for contact form

### P2 (Medium Priority)
- [ ] Parallax scrolling effects
- [ ] SEO optimization
- [ ] Performance optimization

### P3 (Low Priority)
- [ ] Project detail pages
- [ ] Blog/journal section

## Technical Notes
- `framer-motion` was removed due to Babel compilation errors
- Animations implemented with CSS keyframes and JavaScript
- Data stored in MongoDB (with JSON file fallback)
- All content customizable via `/app/backend/data/*.json`

## Preview URL
https://hudstyled-folio.preview.emergentagent.com

## Customization
See `/app/backend/data/CUSTOMIZATION_GUIDE.md` for complete documentation on adding/editing content.
