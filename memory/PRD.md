# ORBYA Portfolio - Product Requirements Document

## Original Problem Statement
Build a high-end, multi-page portfolio website for video editor/motion designer "Shrunit Shirke" (brand name: ORBYA) with an "Iron Man HUD" aesthetic. Everything should be customizable and dynamic.

## Key Features Implemented

### 1. Custom Arc Reactor Cursor
- Perfectly centered equilateral triangles with glow effects
- Motion trail with fade effect
- Expands on hovering interactive elements
- Auto-hides over iframes/video embeds (restored default cursor)
- Disabled on admin panel for usability

### 2. Video Playback
- Featured videos on homepage are clickable and play in modal
- Project cards have hover-to-preview for direct video files (MP4)
- Supports YouTube (including Shorts), Vimeo, Google Drive, and direct MP4 URLs
- Video modal with autoplay and controls

### 3. Admin Panel (`/admin`)
- Password protected (default: orbya2024)
- **Projects Manager:** CRUD with category dropdown, file upload for thumbnails/videos
- **Skills Manager:** Add/edit/delete with category grouping
- **Media Library:** Upload and manage images/videos
- **Stats Manager:** Customize portfolio statistics
- **Quotes Manager:** Manage daily quotes
- **Site Config:** Edit name, tagline, social links, HUD info
- **Color Theme Editor:** 8 presets + custom color pickers with live preview
- **Messages:** View contact form submissions
- Normal cursor behavior (no arc reactor overlay)

### 4. Dynamic Content System
- All content fetched from MongoDB via API
- Categories auto-detected from projects
- Skills auto-grouped by category
- Stats customizable via admin panel

### 5. File Upload System
- Upload images and videos via `/api/upload`
- Files served via `/api/uploads/{type}/{filename}` (ingress-compatible)
- Media library for managing uploaded files

## Architecture
```
/app/
├── backend/ (FastAPI)
│   ├── data/ (JSON seeds + config)
│   ├── static/uploads/ (images/, videos/)
│   ├── tests/test_api.py
│   └── server.py
└── frontend/ (React)
    ├── components/
    │   ├── ReticleCursor.js (iframe-aware cursor hiding)
    │   ├── ProjectCard.js (hover video preview)
    │   ├── GlitchText.js
    │   └── Navigation.js
    └── pages/
        ├── Home.js, Work.js, Skills.js, Contact.js
        └── Admin.js (admin panel with 8 tabs)
```

## API Endpoints

### Projects
- `GET /api/projects` - List all
- `POST /api/projects` - Create
- `PUT /api/projects/{id}` - Update
- `DELETE /api/projects/{id}` - Delete

### Skills
- `GET /api/skills` - CRUD (same pattern)

### Media Upload
- `POST /api/upload` - Upload file (returns /api/uploads/ path)
- `GET /api/uploads/{type}/{filename}` - Serve uploaded file
- `GET /api/media` - List uploaded files
- `DELETE /api/media/{type}/{filename}` - Delete file

### Configuration
- `GET /api/config` / `PUT /api/config`
- `GET /api/stats` / `PUT /api/stats`
- `GET /api/quotes` / `PUT /api/quotes`
- `POST /api/admin/auth` - Login

## Fixes Applied (Feb 2026)
1. Arc reactor cursor hides over iframes/video embeds
2. Admin panel has normal cursor (no arc reactor overlay)
3. Google Drive video URLs parsed correctly (/preview embed)
4. YouTube Shorts URLs parsed correctly (shorts/ -> embed/)
5. File uploads served via /api/uploads/ (ingress-compatible)
6. Noise overlay z-index reduced from 9999 to 1

## Admin Access
- URL: /admin
- Password: orbya2024

## Backlog

### P1 (High Priority)
- [ ] Glitch page transitions between routes
- [ ] Decode text entrance animations
- [ ] Email integration for contact form

### P2 (Medium Priority)
- [ ] Refactor Admin.js into smaller components
- [ ] Centralize video playback logic into reusable VideoPlayer
- [ ] Parallax scrolling effects
- [ ] SEO optimization

### P3 (Low Priority)
- [ ] Project detail pages
- [ ] Blog section
- [ ] Analytics integration
- [ ] Image optimization/compression

## Preview URL
https://tech-specs-preview-1.preview.emergentagent.com
