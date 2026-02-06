# ORBYA Portfolio - Customization Guide

## Overview
Everything in this portfolio is **fully dynamic and customizable** via JSON files or API endpoints. No code changes required!

---

## 📁 Data Files Location
All customizable data is stored in `/app/backend/data/`:
- `projects.json` - Your video projects
- `skills.json` - Your skills and proficiencies  
- `quotes.json` - Quote of the day pool
- `stats.json` - Portfolio statistics

---

## 🎬 Adding Projects (The Vault)

### Via JSON File
Edit `/app/backend/data/projects.json`:

```json
{
  "id": 9,                              // Unique ID (auto-incremented via API)
  "title": "My New Project",            // Project title
  "category": "Music Video",            // Category (auto-creates filter)
  "description": "Project description", // Optional
  "thumbnail": "https://...",           // Image URL
  "videoUrl": "https://youtube.com/...",// YouTube, Vimeo, or direct URL
  "featured": true,                     // Show "FEATURED" badge
  "tags": ["tag1", "tag2"],             // Optional tags
  "year": 2024,                         // Year badge
  "aspectRatio": "16:9"                 // See aspect ratios below
}
```

### Via API
```bash
curl -X POST https://your-domain/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title": "New Project", "category": "Trailer", ...}'
```

### Aspect Ratio Options
- `"16:9"` or `"landscape"` - Standard widescreen
- `"9:16"` or `"vertical"` - Instagram/TikTok reels
- `"1:1"` or `"square"` - Square format
- `"4:3"` - Classic TV format
- `"21:9"` or `"ultrawide"` - Cinematic ultrawide

### Sync Changes to Database
After editing the JSON file:
```bash
curl -X POST https://your-domain/api/projects/sync
```

---

## 💡 Adding Skills (Technical Specs)

### Via JSON File
Edit `/app/backend/data/skills.json`:

```json
{
  "id": 9,                    // Unique ID
  "name": "After Effects",    // Skill name
  "level": 95,                // Proficiency 0-100
  "module": "AE_MODULE_V2.0", // Version/module text
  "category": "software",     // Category for grouping
  "icon": "🎬"                // Optional emoji icon
}
```

### Category Options
Categories auto-group and get icons:
- `"software"` → CPU icon, "Software Mastery" title
- `"creative"` → Sparkles icon, "Creative Systems" title
- `"tools"` → Wrench icon, "Tools & Equipment" title
- `"design"` → Palette icon, "Design Suite" title
- `"development"` → Code icon, "Development Stack" title
- Any other → Zap icon, Category name as title

### Via API
```bash
curl -X POST https://your-domain/api/skills \
  -H "Content-Type: application/json" \
  -d '{"name": "Blender", "level": 80, "category": "software", "module": "BLEND_V3.0"}'
```

### Sync Changes
```bash
curl -X POST https://your-domain/api/skills/sync
```

---

## 📊 Customizing Stats

### Via JSON File
Edit `/app/backend/data/stats.json`:

```json
[
  {"label": "Projects", "value": "200+", "unit": "COMPLETED"},
  {"label": "Experience", "value": "7+", "unit": "YEARS"},
  {"label": "Clients", "value": "100+", "unit": "SATISFIED"},
  {"label": "Hours", "value": "15K+", "unit": "EDITED"}
]
```

### Via API
```bash
curl -X PUT https://your-domain/api/stats \
  -H "Content-Type: application/json" \
  -d '[{"label": "Projects", "value": "200+", "unit": "COMPLETED"}, ...]'
```

---

## 💬 Adding Quotes

Edit `/app/backend/data/quotes.json`:

```json
[
  {"quote": "Every frame tells a story.", "author": "Anonymous"},
  {"quote": "Cut is a four-letter word.", "author": "Walter Murch"}
]
```

A random quote is displayed on the home page, changing daily.

---

## 📞 Contact Messages

Contact form submissions are stored in MongoDB and can be viewed:
```bash
curl https://your-domain/api/contact
```

---

## 📄 Resume Download

Upload your resume PDF to:
```
/app/backend/static/ORBYA_Resume.pdf
```

The download button will automatically serve this file.

---

## 🔄 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Add new project |
| PUT | `/api/projects/{id}` | Update project |
| DELETE | `/api/projects/{id}` | Delete project |
| POST | `/api/projects/sync` | Sync JSON to DB |
| GET | `/api/skills` | List all skills |
| POST | `/api/skills` | Add new skill |
| PUT | `/api/skills/{id}` | Update skill |
| DELETE | `/api/skills/{id}` | Delete skill |
| POST | `/api/skills/sync` | Sync JSON to DB |
| GET | `/api/stats` | Get portfolio stats |
| PUT | `/api/stats` | Update stats |
| GET | `/api/quote` | Get random quote |
| GET | `/api/contact` | List contact messages |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/resume/download` | Download resume |

---

## 🎨 Auto-Alignment Features

### Skills Page
- **Auto-columns**: 1-3 categories → 1-3 columns
- **Equal heights**: Cards auto-expand to match
- **Skill count badge**: Shows count per category

### Work Page (The Vault)
- **Masonry layout**: Different aspect ratios fit together
- **Category filters**: Auto-generated from projects
- **View modes**: Toggle between masonry and grid
- **Video modal**: Click play to watch videos

---

## 🎯 Quick Tips

1. **Images**: Use optimized URLs with dimensions (e.g., `?w=600&h=400`)
2. **Videos**: YouTube and Vimeo URLs auto-embed
3. **Categories**: Just add new categories - filters auto-update
4. **Mobile**: Everything is responsive by default
5. **Loading**: Images lazy-load for performance

---

Need help? Check the API at `/api/` for the root message.
