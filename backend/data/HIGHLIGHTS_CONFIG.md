# 🎬 Home Page Highlights Configuration

## Change Video Display Mode

Edit `/app/frontend/src/pages/Home.js` around line 30:

### For 1 Landscape Video (16:9):
```javascript
setAspectRatio('16:9'); // Shows ONE large video
```

### For 3 Vertical Videos (9:16):
```javascript
setAspectRatio('9:16'); // Shows THREE vertical videos side-by-side
```

---

## How It Works:

### 16:9 Mode (Landscape - Default):
- Displays **1 large featured video**
- Best for cinematic, landscape content
- Full-width display (max 5xl container)
- Great for showcasing main projects

### 9:16 Mode (Portrait):
- Displays **3 vertical videos** in a grid
- Perfect for social media content (Instagram, TikTok, Reels)
- 3-column layout on desktop, stacks on mobile
- Great for showcasing multiple mobile-first projects

---

## Featured Projects Selection:

The system automatically shows:
1. **First priority**: Projects marked with `"featured": true`
2. **Fallback**: If no featured projects, shows first 3 from your portfolio

To mark a project as featured:
```json
{
  "id": 1,
  "title": "Amazing Project",
  "featured": true,  // <-- Add this!
  ...
}
```

Or via API:
```bash
curl -X PUT http://localhost:8001/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Amazing Project",
    "featured": true,
    ...
  }'
```

---

## Quote of the Day:

- **Updates daily** automatically
- Pulls from `/app/backend/data/quotes.json`
- Filmmaking & video editing themed
- Same quote all day (changes at midnight)

### Add Your Own Quotes:

Edit `/app/backend/data/quotes.json`:
```json
{
  "quote": "Your inspiring quote here",
  "author": "Author Name"
}
```

---

## Tips:

### For Best Results:

**16:9 Mode:**
- Use high-quality landscape thumbnails
- Feature your best/most cinematic work
- Ideal for trailers, commercials, films

**9:16 Mode:**
- Use vertical content (1080x1920px ideal)
- Great for social media portfolios
- Perfect for mobile-first content creators

### Mix of Content?
Switch the mode based on your current portfolio focus, or keep it at 16:9 for traditional video editing work.

---

## Quick Switch Guide:

**Current Mode:** 16:9 (1 landscape video)

**To switch:**
1. Open `/app/frontend/src/pages/Home.js`
2. Find line ~30: `setAspectRatio('16:9');`
3. Change to: `setAspectRatio('9:16');`
4. Save - hot reload will update automatically!

No restart needed!
