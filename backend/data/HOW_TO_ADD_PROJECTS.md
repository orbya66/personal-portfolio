# 📹 How to Add Projects to The Vault

## Method 1: Edit JSON File (Easiest)

Simply edit `/app/backend/data/projects.json`:

```json
{
  "id": 7,
  "title": "Your Project Name",
  "category": "Motion Graphics",
  "description": "Project description here",
  "thumbnail": "https://your-image-url.com/thumbnail.jpg",
  "videoUrl": "https://your-video-url.com/video.mp4",
  "featured": true,
  "tags": ["motion", "graphics", "cool"],
  "year": 2024
}
```

### Required Fields:
- `id` (number) - Unique ID for the project
- `title` (string) - Project name
- `category` (string) - Category (e.g., "Motion Graphics", "VFX", "Color Grading")
- `thumbnail` (string) - Image URL for thumbnail
- `videoUrl` (string) - Video URL (YouTube, Vimeo, or direct link)

### Optional Fields:
- `description` (string) - Project description
- `featured` (boolean) - Show as featured project
- `tags` (array) - Tags for filtering
- `year` (number) - Year completed

### After editing:
1. Save the file
2. Call sync endpoint: `POST http://localhost:8001/api/projects/sync`
3. Or restart the backend: `sudo supervisorctl restart backend`

---

## Method 2: Use API Endpoints

### Get all projects:
```bash
curl http://localhost:8001/api/projects
```

### Get single project:
```bash
curl http://localhost:8001/api/projects/1
```

### Add new project:
```bash
curl -X POST http://localhost:8001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Project",
    "category": "Music Video",
    "description": "Amazing music video",
    "thumbnail": "https://example.com/thumb.jpg",
    "videoUrl": "https://example.com/video.mp4",
    "featured": true,
    "tags": ["music", "video"],
    "year": 2024
  }'
```

### Update project:
```bash
curl -X PUT http://localhost:8001/api/projects/7 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "category": "VFX",
    ...
  }'
```

### Delete project:
```bash
curl -X DELETE http://localhost:8001/api/projects/7
```

### Sync JSON to Database:
```bash
curl -X POST http://localhost:8001/api/projects/sync
```

---

## Tips for Best Results:

### 1. Image Thumbnails:
- Use high-quality images (at least 1200x800px)
- Aspect ratio: 16:9 or 3:2
- Use services like Unsplash, Cloudinary, or your own hosting
- Optimize for web (< 500KB)

### 2. Video URLs:
- **YouTube**: Use embed format: `https://www.youtube.com/embed/VIDEO_ID`
- **Vimeo**: Use player format: `https://player.vimeo.com/video/VIDEO_ID`
- **Direct**: Host on Cloudflare Stream, AWS S3, or similar
- Keep videos under 100MB for best performance

### 3. Categories:
Suggested categories:
- Motion Graphics
- VFX Compositing
- Color Grading
- Short Film
- Commercial
- Music Video
- Documentary
- Corporate Video
- Social Media Content
- Title Sequence

### 4. Tags:
Use relevant tags for filtering:
- Software: `after-effects`, `premiere`, `davinci`
- Style: `cinematic`, `minimalist`, `bold`, `abstract`
- Industry: `fashion`, `tech`, `automotive`, `food`

---

## Troubleshooting:

### Projects not showing?
1. Check `/app/backend/data/projects.json` format is valid JSON
2. Restart backend: `sudo supervisorctl restart backend`
3. Check browser console for errors
4. Verify API is working: `curl http://localhost:8001/api/projects`

### Images/Videos not loading?
1. Ensure URLs are publicly accessible
2. Check for HTTPS (some browsers block HTTP content)
3. Verify CORS settings if hosting on different domain

### Need to bulk import?
1. Prepare JSON array with all projects
2. Replace content in `projects.json`
3. Call sync endpoint or restart backend

---

## Unlimited Projects! 🎬

There's **NO LIMIT** to how many projects you can add. The system uses:
- Efficient MongoDB storage
- Lazy loading for performance
- Masonry grid that adapts to any number of items
- Optimized rendering for hundreds of projects

Just keep adding to the JSON file or use the API!
