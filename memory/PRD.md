# ORBYA Portfolio - Product Requirements Document

## Original Problem Statement
Build a high-end, multi-page portfolio website for video editor/motion designer "Shrunit Shirke" (brand name: ORBYA) with an "Iron Man HUD" aesthetic.

## Core Requirements
- **Visual Theme:** Pure black background (#000000), glowing orange (#FF4D00) accents, minimalist, cinematic, industrial style
- **Pages:** Home, Work (The Vault), Skills (Technical Specs), Contact (Comms)
- **Content:** Dynamic projects, skills, quotes fetched from backend JSON files
- **Custom Cursor:** Arc reactor-inspired cursor with smooth motion trail
- **Animations:** HUD-style entrance animations, hover effects

## User Personas
- Primary: Potential clients (film studios, content creators) looking to hire a video editor
- Secondary: Recruiters reviewing portfolio

## Architecture
```
/app/
├── backend/ (FastAPI)
│   ├── data/
│   │   ├── projects.json    # Dynamic project data
│   │   ├── skills.json      # Dynamic skills data
│   │   └── quotes.json      # Quote of the day pool
│   ├── static/
│   │   └── resume.pdf
│   └── server.py            # API endpoints
└── frontend/ (React)
    ├── components/
    │   ├── ReticleCursor.js # Custom cursor
    │   ├── GlitchText.js    # Text animation
    │   ├── ProjectCard.js   # Project display
    │   └── SkillBar.js      # Skill progress bar
    └── pages/
        ├── Home.js
        ├── Work.js
        ├── Skills.js
        └── Contact.js
```

## API Endpoints
- `GET /api/projects` - Fetch all projects
- `POST /api/projects/add` - Add new project
- `GET /api/skills` - Fetch all skills
- `POST /api/skills/add` - Add new skill
- `GET /api/quote` - Random quote
- `POST /api/contact` - Contact form (logs to console)
- `GET /api/resume/download` - Download resume

## What's Been Implemented (Dec 2025)

### ✅ Completed
- Multi-page portfolio with React Router
- Iron Man HUD aesthetic with black/orange theme
- Custom arc reactor cursor with motion trail
- Dynamic content system (projects, skills from JSON)
- Home page with:
  - Live system time display
  - Rotating arc reactor rings
  - Status indicators (AVAILABLE/FREELANCE)
  - HUD data points (SYS_TIME, STATUS, LOCATION, VERSION)
  - Mission Briefing section with featured project
  - Quote of the day
- Work page with:
  - Stats bar (projects count, categories, year range)
  - Category filter buttons
  - Masonry grid layout
- Skills page with:
  - Software Mastery & Creative Systems sections
  - Stats cards with icons
  - Resume download button
- Contact page with:
  - Contact form
  - Social links
  - Response protocol info
- Decorative HUD elements on all pages
- Fixed corner brackets decoration
- Responsive design

### ⚠️ Mocked/Simplified
- Contact form logs to console (no email integration)
- Video playback on project cards (clicking play does nothing)

## Backlog

### P1 (High Priority)
- [ ] Implement "Glitch" page transitions
- [ ] Implement "Decode" text entrance animations
- [ ] Enable video playback functionality (modal player)
- [ ] Add parallax scrolling effects

### P2 (Medium Priority)
- [ ] Email integration for contact form
- [ ] SEO optimization
- [ ] Performance optimization (image lazy loading)

### P3 (Low Priority)
- [ ] Add more HUD-style visual effects
- [ ] Project detail pages
- [ ] Blog/journal section

## Technical Notes
- `framer-motion` was removed due to Babel compilation errors
- Animations implemented with CSS keyframes and JavaScript
- Data stored in flat JSON files (no database)

## Preview URL
https://hudstyled-folio.preview.emergentagent.com
