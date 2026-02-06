# 🛠️ How to Add & Manage Skills in Tech Specs

## Method 1: Edit JSON File (Easiest)

Simply edit `/app/backend/data/skills.json`:

```json
{
  "id": 9,
  "name": "Cinema 4D",
  "level": 80,
  "module": "C4D_MODULE_V1.0",
  "category": "software",
  "icon": "🎭"
}
```

### Required Fields:
- `id` (number) - Unique ID for the skill
- `name` (string) - Skill name
- `level` (number) - Proficiency level (0-100)
- `category` (string) - Either "software" or "creative"

### Optional Fields:
- `module` (string) - Module version (e.g., "AE_MODULE_V2.0")
- `icon` (string) - Emoji icon (displayed in future versions)

### Categories:
- **software**: Appears in "Software Mastery" section (left column)
- **creative**: Appears in "Creative Systems" section (right column)

### After editing:
1. Save the file
2. Call sync endpoint: `POST http://localhost:8001/api/skills/sync`
3. Or restart the backend: `sudo supervisorctl restart backend`

---

## Method 2: Use API Endpoints

### Get all skills:
```bash
curl http://localhost:8001/api/skills
```

### Get single skill:
```bash
curl http://localhost:8001/api/skills/1
```

### Add new skill:
```bash
curl -X POST http://localhost:8001/api/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blender",
    "level": 75,
    "module": "BLENDER_V3.0",
    "category": "software",
    "icon": "🔷"
  }'
```

### Update skill:
```bash
curl -X PUT http://localhost:8001/api/skills/9 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blender",
    "level": 85,
    "module": "BLENDER_V3.5",
    "category": "software",
    "icon": "🔷"
  }'
```

### Delete skill:
```bash
curl -X DELETE http://localhost:8001/api/skills/9
```

### Sync JSON to Database:
```bash
curl -X POST http://localhost:8001/api/skills/sync
```

---

## Skill Examples by Category:

### Software Skills:
- After Effects
- Premiere Pro
- Photoshop
- DaVinci Resolve
- Final Cut Pro
- Cinema 4D
- Blender
- Nuke
- Fusion
- Maya

### Creative Skills:
- Motion Graphics
- Color Grading
- VFX Compositing
- Sound Design
- 3D Animation
- Typography
- Storyboarding
- Video Editing
- Animation
- Cinematography

---

## Skill Level Guidelines:

**0-30**: Beginner (Learning phase)
**31-60**: Intermediate (Working knowledge)
**61-80**: Advanced (Proficient & experienced)
**81-95**: Expert (Industry professional)
**96-100**: Master (Top-tier specialist)

---

## Tips for Best Display:

### 1. Keep it Balanced:
- Aim for 4-6 skills per category
- Total of 8-12 skills looks best
- Can add more if needed - no limit!

### 2. Use Descriptive Names:
- ✅ "Motion Graphics Design"
- ✅ "VFX Compositing"
- ❌ "MG"
- ❌ "VFX"

### 3. Module Names:
Use format: `SOFTWARE_MODULE_VERSION`
- Examples: `AE_MODULE_V2.0`, `PR_SYSTEM_V1.8`
- Makes it look more technical/HUD-like

### 4. Order by Level:
Higher skills first gives better visual impact

---

## Adding Many Skills at Once:

Edit the JSON file and add multiple entries:

```json
[
  {
    "id": 1,
    "name": "After Effects",
    "level": 95,
    "module": "AE_MODULE_V2.0",
    "category": "software"
  },
  {
    "id": 2,
    "name": "Premiere Pro",
    "level": 90,
    "module": "PR_MODULE_V1.8",
    "category": "software"
  },
  ... add as many as you want ...
]
```

Then sync: `curl -X POST http://localhost:8001/api/skills/sync`

---

## Troubleshooting:

### Skills not showing?
1. Check `/app/backend/data/skills.json` format is valid JSON
2. Restart backend: `sudo supervisorctl restart backend`
3. Check browser console for errors
4. Verify API: `curl http://localhost:8001/api/skills`

### Layout issues?
- Keep skills balanced between categories
- If too many in one category, reassign some
- Ideal: 4-6 per category

### Want to reorganize?
1. Edit the JSON file
2. Change category values
3. Sync or restart

---

## No Limits! 🚀

Add as many skills as you want! The system automatically:
- Organizes by category
- Animates skill bars
- Displays module versions
- Handles unlimited entries

Perfect for showcasing your complete skill set!
