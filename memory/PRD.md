# ORBYA Portfolio - Product Requirements Document

## Original Problem Statement
Build a high-end, multi-page portfolio website for video editor/motion designer "Shrunit Shirke" (brand name: ORBYA) with an "Iron Man HUD" aesthetic. Everything should be customizable and dynamic.

## Key Features Implemented

### 1. Custom Arc Reactor Cursor ✅
- Perfectly centered equilateral triangles
- Smooth rotation animation
- Motion trail with fade effect
- Expands on hovering interactive elements

### 2. Video Playback ✅
- Featured videos on homepage are clickable and play in modal
- Project cards have hover-to-preview for direct video files (MP4)
- Supports YouTube, Vimeo, Google Drive, and direct MP4 URLs
- Video modal with autoplay and controls

### 3. Admin Panel ✅ (`/admin`)
- Password protected (default: orbya2024)
- **Projects Manager:**
  - Category dropdown with existing categories
  - "Add New Category" option
  - File upload for thumbnails and videos
  - Supports YouTube/Vimeo/MP4/Google Drive URLs
- **Skills Manager:** Add/edit/delete with category grouping
- **Media Library:** Upload and manage images/videos
- **Stats Manager:** Customize portfolio statistics
- **Quotes Manager:** Manage daily quotes
- **Site Config:** Edit name, tagline, social links, HUD info
- **Color Theme Editor:**
  - 8 preset themes
  - Custom color pickers
  - Live preview
  - Real-time color application

### 4. Dynamic Content System ✅
- All content fetched from API
- Categories auto-detected from projects
- Skills auto-grouped by category
- Stats customizable via admin panel

## Architecture
```
/app/
├── backend/ (FastAPI)
│   ├── data/
│   │   ├── projects.json
│   │   ├── skills.json
│   │   ├── quotes.json
│   │   ├── stats.json
│   │   └── config.json
│   ├── static/uploads/
│   │   ├── images/
│   │   └── videos/
│   └── server.py
└── frontend/ (React)
    ├── components/
    │   ├── ReticleCursor.js (Fixed alignment)
    │   ├── ProjectCard.js (Hover video preview)
    │   └── ...
    └── pages/
        ├── Home.js (Video modal)
        ├── Work.js (Video modal, filters)
        ├── Skills.js
        ├── Contact.js
        └── Admin.js (Complete admin panel)
```

## API Endpoints

### Projects
- `GET /api/projects` - List all
- `POST /api/projects` - Create
- `PUT /api/projects/{id}` - Update
- `DELETE /api/projects/{id}` - Delete

### Skills
- `GET /api/skills` - List all
- `POST /api/skills` - Create
- `PUT /api/skills/{id}` - Update
- `DELETE /api/skills/{id}` - Delete

### Media Upload
- `POST /api/upload` - Upload file (images/videos)
- `GET /api/media` - List uploaded files
- `DELETE /api/media/{type}/{filename}` - Delete file

### Configuration
- `GET /api/config` - Get site config
- `PUT /api/config` - Update config (including colors)
- `GET /api/stats` - Get stats
- `PUT /api/stats` - Update stats
- `GET /api/quotes` - Get all quotes
- `PUT /api/quotes` - Update quotes

### Admin
- `POST /api/admin/auth` - Login
- `PUT /api/admin/password` - Change password

## Color Themes
1. Iron Man (Default) - Orange/Black
2. Cyberpunk - Cyan/Dark
3. Matrix - Green/Black
4. Purple Haze - Purple/Dark
5. Gold Rush - Gold/Dark
6. Ocean Blue - Blue/Navy
7. Hot Pink - Pink/Dark
8. Emerald - Green/Dark

## Video Support
- **YouTube:** Auto-detects and embeds
- **Vimeo:** Auto-detects and embeds
- **Google Drive:** Extracts file ID and creates preview URL
- **Direct MP4:** Native video player with autoplay on hover

## Fixes Applied (Dec 2025)
1. ✅ Arc reactor cursor - Fixed triangle alignment using equilateral triangle math
2. ✅ Featured videos now playable - Added video modal
3. ✅ Hover video autoplay - Direct videos play on hover
4. ✅ Admin panel config saves properly - Fixed save functions
5. ✅ Category dropdown - Shows existing categories + add new option
6. ✅ Admin panel alignment - Removed HUD frame overlapping issues
7. ✅ File upload - Images and videos can be uploaded directly
8. ✅ Google Drive support - Added URL parsing for Drive links

## Preview URL
https://tech-specs-preview-1.preview.emergentagent.com

## Admin Access
- URL: /admin
- Password: orbya2024

## Backlog

### P1 (High Priority)
- [ ] Glitch page transitions
- [ ] Decode text animations
- [ ] Email integration for contact form

### P2 (Medium Priority)
- [ ] Parallax scrolling
- [ ] SEO optimization
- [ ] Image optimization/compression

### P3 (Low Priority)
- [ ] Project detail pages
- [ ] Blog section
- [ ] Analytics integration
