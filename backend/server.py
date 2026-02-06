from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import json


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

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

class ProjectCreate(BaseModel):
    title: str
    category: str
    description: Optional[str] = ""
    thumbnail: str
    videoUrl: str
    featured: Optional[bool] = False
    tags: Optional[List[str]] = []
    year: Optional[int] = None


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


@api_router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    """Add a new project"""
    # Get the highest ID
    existing_projects = await db.projects.find({}, {"_id": 0, "id": 1}).to_list(1000)
    
    if not existing_projects:
        # Check JSON file
        projects_file = ROOT_DIR / "data" / "projects.json"
        if projects_file.exists():
            with open(projects_file, 'r') as f:
                existing_projects = json.load(f)
    
    max_id = max([p.get("id", 0) for p in existing_projects]) if existing_projects else 0
    new_id = max_id + 1
    
    project_dict = project.model_dump()
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
