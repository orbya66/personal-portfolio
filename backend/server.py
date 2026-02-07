from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import shutil
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import json


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory if not exists
UPLOADS_DIR = ROOT_DIR / "static" / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Mount static files for uploads
app.mount("/static", StaticFiles(directory=str(ROOT_DIR / "static")), name="static")


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: int
    title: str
    category: str
    description: Optional[str] = ""
    thumbnail: str
    videoUrl: str
    featured: Optional[bool] = False
    tags: Optional[List[str]] = []
    year: Optional[int] = None
    aspectRatio: Optional[str] = "16:9"

class ProjectCreate(BaseModel):
    title: str
    category: str
    description: Optional[str] = ""
    thumbnail: str
    videoUrl: str
    featured: Optional[bool] = False
    tags: Optional[List[str]] = []
    year: Optional[int] = None
    aspectRatio: Optional[str] = "16:9"


class Skill(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: int
    name: str
    level: int
    module: Optional[str] = ""
    category: str
    icon: Optional[str] = ""

class SkillCreate(BaseModel):
    name: str
    level: int
    module: Optional[str] = ""
    category: str
    icon: Optional[str] = ""


# Existing routes
@api_router.get("/")
async def root():
    return {"message": "ORBYA Portfolio API - System Online"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Contact form endpoint
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(input: ContactMessageCreate):
    contact_dict = input.model_dump()
    contact_obj = ContactMessage(**contact_dict)
    
    doc = contact_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.contact_messages.insert_one(doc)
    
    return contact_obj


# Get all contact messages
@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).to_list(1000)
    
    for msg in messages:
        if isinstance(msg['timestamp'], str):
            msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
    
    return messages


# Resume download endpoint
@api_router.get("/resume/download")
async def download_resume():
    resume_path = ROOT_DIR / "static" / "ORBYA_Resume.pdf"
    
    if not resume_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Resume file not found. Please upload a PDF file to /app/backend/static/ORBYA_Resume.pdf"
        )
    
    return FileResponse(
        path=resume_path,
        media_type="application/pdf",
        filename="ORBYA_Resume.pdf"
    )


# Projects endpoints
@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    """Get all projects from MongoDB or JSON file"""
    # Try MongoDB first
    projects = await db.projects.find({}, {"_id": 0}).to_list(1000)
    
    if not projects:
        # Fallback to JSON file
        projects_file = ROOT_DIR / "data" / "projects.json"
        if projects_file.exists():
            with open(projects_file, 'r') as f:
                projects = json.load(f)
    
    return projects


@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: int):
    """Get a specific project by ID"""
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    
    if not project:
        # Try JSON file
        projects_file = ROOT_DIR / "data" / "projects.json"
        if projects_file.exists():
            with open(projects_file, 'r') as f:
                projects = json.load(f)
                project = next((p for p in projects if p["id"] == project_id), None)
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project


import re as _re

def _auto_youtube_thumbnail(video_url: str) -> str:
    """Extract YouTube video ID and return thumbnail URL"""
    if not video_url:
        return ""
    patterns = [
        r'youtu\.be/([a-zA-Z0-9_-]+)',
        r'youtube\.com/watch\?v=([a-zA-Z0-9_-]+)',
        r'youtube\.com/shorts/([a-zA-Z0-9_-]+)',
        r'youtube\.com/embed/([a-zA-Z0-9_-]+)',
    ]
    for p in patterns:
        m = _re.search(p, video_url)
        if m:
            return f"https://img.youtube.com/vi/{m.group(1)}/hqdefault.jpg"
    return ""


@api_router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    """Add a new project"""
    existing_projects = await db.projects.find({}, {"_id": 0, "id": 1}).to_list(1000)
    
    if not existing_projects:
        projects_file = ROOT_DIR / "data" / "projects.json"
        if projects_file.exists():
            with open(projects_file, 'r') as f:
                existing_projects = json.load(f)
    
    max_id = max([p.get("id", 0) for p in existing_projects]) if existing_projects else 0
    new_id = max_id + 1
    
    project_dict = project.model_dump()
    # Auto-generate YouTube thumbnail if none provided
    if not project_dict.get("thumbnail") and project_dict.get("videoUrl"):
        project_dict["thumbnail"] = _auto_youtube_thumbnail(project_dict["videoUrl"])
    
    project_obj = Project(id=new_id, **project_dict)
    
    doc = project_obj.model_dump()
    await db.projects.insert_one(doc)
    
    return project_obj


@api_router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: int, project: ProjectCreate):
    """Update an existing project"""
    existing = await db.projects.find_one({"id": project_id}, {"_id": 0})
    
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project.model_dump()
    update_data["id"] = project_id
    # Auto-generate YouTube thumbnail if none provided
    if not update_data.get("thumbnail") and update_data.get("videoUrl"):
        update_data["thumbnail"] = _auto_youtube_thumbnail(update_data["videoUrl"])
    
    await db.projects.replace_one({"id": project_id}, update_data)
    
    return Project(**update_data)


@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: int):
    """Delete a project"""
    result = await db.projects.delete_one({"id": project_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted successfully", "id": project_id}


@api_router.post("/projects/sync")
async def sync_projects_to_db():
    """Sync projects from JSON file to MongoDB"""
    projects_file = ROOT_DIR / "data" / "projects.json"
    
    if not projects_file.exists():
        raise HTTPException(status_code=404, detail="Projects JSON file not found")
    
    with open(projects_file, 'r') as f:
        projects = json.load(f)
    
    # Clear existing projects
    await db.projects.delete_many({})
    
    # Insert all projects
    if projects:
        await db.projects.insert_many(projects)
    
    return {"message": f"Synced {len(projects)} projects to database"}


# Skills endpoints
@api_router.get("/skills", response_model=List[Skill])
async def get_skills():
    """Get all skills from MongoDB or JSON file"""
    # Try MongoDB first
    skills = await db.skills.find({}, {"_id": 0}).to_list(1000)
    
    if not skills:
        # Fallback to JSON file
        skills_file = ROOT_DIR / "data" / "skills.json"
        if skills_file.exists():
            with open(skills_file, 'r') as f:
                skills = json.load(f)
    
    return skills


@api_router.get("/skills/{skill_id}", response_model=Skill)
async def get_skill(skill_id: int):
    """Get a specific skill by ID"""
    skill = await db.skills.find_one({"id": skill_id}, {"_id": 0})
    
    if not skill:
        # Try JSON file
        skills_file = ROOT_DIR / "data" / "skills.json"
        if skills_file.exists():
            with open(skills_file, 'r') as f:
                skills = json.load(f)
                skill = next((s for s in skills if s["id"] == skill_id), None)
    
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return skill


@api_router.post("/skills", response_model=Skill)
async def create_skill(skill: SkillCreate):
    """Add a new skill"""
    # Get the highest ID
    existing_skills = await db.skills.find({}, {"_id": 0, "id": 1}).to_list(1000)
    
    if not existing_skills:
        # Check JSON file
        skills_file = ROOT_DIR / "data" / "skills.json"
        if skills_file.exists():
            with open(skills_file, 'r') as f:
                existing_skills = json.load(f)
    
    max_id = max([s.get("id", 0) for s in existing_skills]) if existing_skills else 0
    new_id = max_id + 1
    
    skill_dict = skill.model_dump()
    skill_obj = Skill(id=new_id, **skill_dict)
    
    doc = skill_obj.model_dump()
    await db.skills.insert_one(doc)
    
    return skill_obj


@api_router.put("/skills/{skill_id}", response_model=Skill)
async def update_skill(skill_id: int, skill: SkillCreate):
    """Update an existing skill"""
    existing = await db.skills.find_one({"id": skill_id}, {"_id": 0})
    
    if not existing:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    update_data = skill.model_dump()
    update_data["id"] = skill_id
    
    await db.skills.replace_one({"id": skill_id}, update_data)
    
    return Skill(**update_data)


@api_router.delete("/skills/{skill_id}")
async def delete_skill(skill_id: int):
    """Delete a skill"""
    result = await db.skills.delete_one({"id": skill_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return {"message": "Skill deleted successfully", "id": skill_id}


@api_router.post("/skills/sync")
async def sync_skills_to_db():
    """Sync skills from JSON file to MongoDB"""
    skills_file = ROOT_DIR / "data" / "skills.json"
    
    if not skills_file.exists():
        raise HTTPException(status_code=404, detail="Skills JSON file not found")
    
    with open(skills_file, 'r') as f:
        skills = json.load(f)
    
    # Clear existing skills
    await db.skills.delete_many({})
    
    # Insert all skills
    if skills:
        await db.skills.insert_many(skills)
    
    return {"message": f"Synced {len(skills)} skills to database"}


# Quote of the day endpoint
@api_router.get("/quote")
async def get_quote_of_the_day():
    """Get a random quote from filmmaking/video editing"""
    quotes_file = ROOT_DIR / "data" / "quotes.json"
    
    if not quotes_file.exists():
        return {"quote": "Every frame tells a story.", "author": "Anonymous"}
    
    with open(quotes_file, 'r') as f:
        quotes = json.load(f)
    
    if not quotes:
        return {"quote": "Every frame tells a story.", "author": "Anonymous"}
    
    # Use date-based random for consistent quote per day
    import random
    from datetime import date
    today = date.today()
    seed = today.year * 10000 + today.month * 100 + today.day
    random.seed(seed)
    
    return random.choice(quotes)


# Stats endpoint for dynamic stats
@api_router.get("/stats")
async def get_stats():
    """Get portfolio statistics from JSON file or return defaults"""
    stats_file = ROOT_DIR / "data" / "stats.json"
    
    if stats_file.exists():
        with open(stats_file, 'r') as f:
            return json.load(f)
    
    # Default stats
    return [
        {"label": "Projects", "value": "150+", "unit": "COMPLETED"},
        {"label": "Experience", "value": "5+", "unit": "YEARS"},
        {"label": "Clients", "value": "80+", "unit": "SATISFIED"},
        {"label": "Hours", "value": "10K+", "unit": "EDITED"}
    ]


@api_router.put("/stats")
async def update_stats(stats: List[dict]):
    """Update portfolio statistics"""
    stats_file = ROOT_DIR / "data" / "stats.json"
    
    with open(stats_file, 'w') as f:
        json.dump(stats, f, indent=2)
    
    return {"message": "Stats updated successfully", "stats": stats}


# Site Configuration endpoints
@api_router.get("/config")
async def get_config():
    """Get site configuration"""
    config_file = ROOT_DIR / "data" / "config.json"
    
    if config_file.exists():
        with open(config_file, 'r') as f:
            config = json.load(f)
            # Don't expose password in public endpoint
            public_config = {k: v for k, v in config.items() if k != 'adminPassword'}
            return public_config
    
    # Default config
    return {
        "siteName": "ORBYA",
        "ownerName": "SHRUNIT SHIRKE",
        "tagline": "CINEMATIC VIDEO EDITOR • MOTION DESIGNER • VISUAL STORYTELLER",
        "colors": {
            "primary": "#FF4D00",
            "background": "#000000",
            "text": "#FFFFFF"
        }
    }


@api_router.put("/config")
async def update_config(config: dict):
    """Update site configuration"""
    config_file = ROOT_DIR / "data" / "config.json"
    
    # Load existing config to preserve password
    existing_config = {}
    if config_file.exists():
        with open(config_file, 'r') as f:
            existing_config = json.load(f)
    
    # Merge with existing config (preserve password if not provided)
    if 'adminPassword' not in config and 'adminPassword' in existing_config:
        config['adminPassword'] = existing_config['adminPassword']
    
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    # Return without password
    public_config = {k: v for k, v in config.items() if k != 'adminPassword'}
    return {"message": "Config updated successfully", "config": public_config}


# Admin authentication
class AdminAuth(BaseModel):
    password: str

@api_router.post("/admin/auth")
async def admin_authenticate(auth: AdminAuth):
    """Authenticate admin user"""
    config_file = ROOT_DIR / "data" / "config.json"
    
    if config_file.exists():
        with open(config_file, 'r') as f:
            config = json.load(f)
            if auth.password == config.get('adminPassword', 'admin'):
                return {"success": True, "message": "Authentication successful"}
    
    raise HTTPException(status_code=401, detail="Invalid password")


@api_router.put("/admin/password")
async def change_admin_password(data: dict):
    """Change admin password"""
    config_file = ROOT_DIR / "data" / "config.json"
    
    if not config_file.exists():
        raise HTTPException(status_code=404, detail="Config file not found")
    
    with open(config_file, 'r') as f:
        config = json.load(f)
    
    if data.get('currentPassword') != config.get('adminPassword'):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    
    config['adminPassword'] = data.get('newPassword')
    
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    return {"success": True, "message": "Password changed successfully"}


# File Upload endpoints
ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/gif', 'image/webp'}
ALLOWED_VIDEO_TYPES = {'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB


@api_router.get("/uploads/{media_type}/{filename}")
async def serve_upload(media_type: str, filename: str):
    """Serve uploaded files through /api route for ingress compatibility"""
    if media_type not in ["images", "videos"]:
        raise HTTPException(status_code=400, detail="Invalid media type")
    
    file_path = UPLOADS_DIR / media_type / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(path=file_path)


@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file (image or video)"""
    # Check file type
    content_type = file.content_type
    is_image = content_type in ALLOWED_IMAGE_TYPES
    is_video = content_type in ALLOWED_VIDEO_TYPES
    
    if not is_image and not is_video:
        raise HTTPException(
            status_code=400, 
            detail="File type not allowed. Allowed: images (jpeg, png, gif, webp) and videos (mp4, webm, mov, avi)"
        )
    
    # Generate unique filename
    file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'bin'
    unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
    
    # Determine subfolder
    subfolder = "images" if is_image else "videos"
    upload_path = UPLOADS_DIR / subfolder
    upload_path.mkdir(exist_ok=True)
    
    file_path = upload_path / unique_filename
    
    # Save file
    try:
        with open(file_path, 'wb') as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Get file info
    file_size = os.path.getsize(file_path)
    
    # Build URL - use /api/uploads path for ingress compatibility
    relative_url = f"/api/uploads/{subfolder}/{unique_filename}"
    
    return {
        "success": True,
        "filename": unique_filename,
        "original_name": file.filename,
        "type": "image" if is_image else "video",
        "content_type": content_type,
        "size": file_size,
        "url": relative_url
    }


@api_router.get("/media")
async def list_media():
    """List all uploaded media files"""
    media = {"images": [], "videos": []}
    
    # List images
    images_dir = UPLOADS_DIR / "images"
    if images_dir.exists():
        for file in images_dir.iterdir():
            if file.is_file():
                media["images"].append({
                    "filename": file.name,
                    "url": f"/api/uploads/images/{file.name}",
                    "size": os.path.getsize(file),
                    "modified": datetime.fromtimestamp(os.path.getmtime(file)).isoformat()
                })
    
    # List videos
    videos_dir = UPLOADS_DIR / "videos"
    if videos_dir.exists():
        for file in videos_dir.iterdir():
            if file.is_file():
                media["videos"].append({
                    "filename": file.name,
                    "url": f"/api/uploads/videos/{file.name}",
                    "size": os.path.getsize(file),
                    "modified": datetime.fromtimestamp(os.path.getmtime(file)).isoformat()
                })
    
    # Sort by modified date (newest first)
    media["images"].sort(key=lambda x: x["modified"], reverse=True)
    media["videos"].sort(key=lambda x: x["modified"], reverse=True)
    
    return media


@api_router.delete("/media/{media_type}/{filename}")
async def delete_media(media_type: str, filename: str):
    """Delete a media file"""
    if media_type not in ["images", "videos"]:
        raise HTTPException(status_code=400, detail="Invalid media type")
    
    file_path = UPLOADS_DIR / media_type / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        os.remove(file_path)
        return {"success": True, "message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")


# Quotes endpoints
@api_router.get("/quotes")
async def get_all_quotes():
    """Get all quotes"""
    quotes_file = ROOT_DIR / "data" / "quotes.json"
    
    if quotes_file.exists():
        with open(quotes_file, 'r') as f:
            return json.load(f)
    
    return []


@api_router.put("/quotes")
async def update_quotes(quotes: List[dict]):
    """Update all quotes"""
    quotes_file = ROOT_DIR / "data" / "quotes.json"
    
    with open(quotes_file, 'w') as f:
        json.dump(quotes, f, indent=2)
    
    return {"message": "Quotes updated successfully", "count": len(quotes)}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
