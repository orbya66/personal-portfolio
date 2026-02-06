# ORBYA Portfolio - Product Requirements Document

## Original Problem Statement
Build a high-end, multi-page portfolio website for video editor/motion designer "Shrunit Shirke" (brand name: ORBYA) with an "Iron Man HUD" aesthetic. **Everything should be customizable and dynamic, including colors.**

## Core Requirements
- **Visual Theme:** Pure black background, glowing orange accents (fully customizable via admin panel)
- **Pages:** Home, Work (The Vault), Skills (Technical Specs), Contact (Comms), Admin Panel
- **Content:** Dynamic projects, skills, quotes fetched from backend
- **Custom Cursor:** Arc reactor-inspired cursor with smooth motion trail
- **Animations:** HUD-style entrance animations, hover effects
- **Fully Customizable:** Everything editable via Admin Panel - no code changes needed

## User Personas
- Primary: Potential clients (film studios, content creators) looking to hire a video editor
- Secondary: Recruiters reviewing portfolio

## Architecture
```
/app/
├── backend/ (FastAPI)
│   ├── data/
│   │   ├── projects.json       # Dynamic project data
│   │   ├── skills.json         # Dynamic skills data
│   │   ├── quotes.json         # Quote of the day pool
│   │   ├── stats.json          # Portfolio statistics
│   │   ├── config.json         # Site configuration & colors
│   │   └── CUSTOMIZATION_GUIDE.md
│   ├── static/
│   │   └── ORBYA_Resume.pdf
│   └── server.py               # API endpoints (full CRUD)
└── frontend/ (React)
    ├── components/
    │   ├── ReticleCursor.js    # Custom cursor
    │   ├── GlitchText.js       # Text animation
    │   ├── ProjectCard.js      # Project display (multi-aspect ratio)
    │   ├── SkillBar.js         # Skill progress bar
    │   └── Navigation.js
    └── pages/
        ├── Home.js             # HUD data displays, rotating rings
        ├── Work.js             # Video modal, category filters
        ├── Skills.js           # Auto-grouping categories
        ├── Contact.js          # Contact form
        └── Admin.js            # Full admin panel
```

## API Endpoints
### Projects
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Add new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/sync` - Sync JSON to MongoDB

### Skills
- `GET /api/skills` - Fetch all skills
- `POST /api/skills` - Add new skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill
- `POST /api/skills/sync` - Sync JSON to MongoDB

### Configuration
- `GET /api/config` - Get site configuration
- `PUT /api/config` - Update site configuration
- `GET /api/stats` - Get portfolio stats
- `PUT /api/stats` - Update portfolio stats
- `GET /api/quotes` - Get all quotes
- `PUT /api/quotes` - Update quotes
- `POST /api/admin/auth` - Admin authentication
- `PUT /api/admin/password` - Change admin password

### Other
- `GET /api/quote` - Random quote
- `POST /api/contact` - Contact form submission
- `GET /api/contact` - List contact messages
- `GET /api/resume/download` - Download resume

## What's Been Implemented (Dec 2025)

### ✅ Completed Features

**Admin Panel (NEW - /admin):**
- Password-protected access (default: orbya2024)
- **Projects Manager:** Add, edit, delete projects with thumbnails
- **Skills Manager:** Add, edit, delete skills with level slider
- **Stats Manager:** Customize portfolio statistics
- **Quotes Manager:** Add, edit, delete daily quotes
- **Site Config:** Edit site name, tagline, social links, HUD info
- **Color Theme Editor:**
  - 8 preset themes (Iron Man, Cyberpunk, Matrix, Purple Haze, Gold Rush, Ocean Blue, Hot Pink, Emerald)
  - Custom color pickers for all colors
  - Live preview
  - Real-time color application via CSS variables
- **Messages Viewer:** View all contact form submissions

**Home Page:**
- Live system time display (SYS_TIME)
- Rotating arc reactor rings around title
- Status indicators (ONLINE, LOCATION, VERSION)
- Availability badges (AVAILABLE/FREELANCE)
- Mission Briefing with featured project
- Quote of the day

**Work Page (The Vault):**
- Dynamic category filters (auto-detected)
- Stats bar (project count, categories, year range)
- Masonry layout for mixed aspect ratios
- Grid view option
- Video modal player (YouTube/Vimeo/direct URLs)
- Featured/year badges, tags display

**Skills Page (Technical Specs):**
- Auto-grouping by category
- Dynamic column layout (1-3 columns)
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
- Dynamic color theming via CSS variables
- Full CRUD API for all content

### ⚠️ Mocked/Simplified
- Contact form stores messages but doesn't send emails

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

### Color Presets Available
1. Iron Man (Orange/Black) - Default
2. Cyberpunk (Cyan/Dark)
3. Matrix (Green/Black)
4. Purple Haze (Purple/Dark)
5. Gold Rush (Gold/Dark)
6. Ocean Blue (Blue/Dark Blue)
7. Hot Pink (Pink/Dark)
8. Emerald (Green/Dark Green)

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
- Colors are applied via CSS custom properties (variables)
- Admin panel uses session storage for auth state

## Preview URL
https://hudstyled-folio.preview.emergentagent.com

## Admin Panel Access
- URL: https://hudstyled-folio.preview.emergentagent.com/admin
- Default Password: `orbya2024`

## Customization Guide
See `/app/backend/data/CUSTOMIZATION_GUIDE.md` for complete documentation on adding/editing content via JSON files or API.
