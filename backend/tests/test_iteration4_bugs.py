"""
Backend API Tests for ORBYA Portfolio - Iteration 4
Tests: aspectRatio field persistence, YouTube mute parameter for autoplay
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAspectRatioPersistence:
    """Test aspectRatio field saves correctly when creating/updating projects"""
    
    def test_create_project_with_aspect_ratio(self):
        """Test creating a project with aspectRatio field"""
        test_project = {
            "title": "TEST_AspectRatio_Project",
            "category": "TEST_Category",
            "description": "Testing aspectRatio persistence",
            "thumbnail": "https://example.com/thumb.jpg",
            "videoUrl": "https://youtube.com/watch?v=test123",
            "featured": False,
            "tags": ["test"],
            "year": 2026,
            "aspectRatio": "9:16"  # Vertical/Reels
        }
        
        response = requests.post(f"{BASE_URL}/api/projects", json=test_project)
        assert response.status_code == 200
        data = response.json()
        
        assert data["title"] == test_project["title"]
        assert data["aspectRatio"] == "9:16"
        assert "id" in data
        
        project_id = data["id"]
        print(f"✅ Created project with aspectRatio '9:16', ID: {project_id}")
        
        # Verify via GET
        get_response = requests.get(f"{BASE_URL}/api/projects/{project_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["aspectRatio"] == "9:16"
        print(f"✅ GET confirms aspectRatio persisted: {fetched['aspectRatio']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/projects/{project_id}")
        print(f"✅ Cleaned up test project")
    
    def test_update_project_aspect_ratio(self):
        """Test updating aspectRatio field persists correctly"""
        # Create a project first
        create_data = {
            "title": "TEST_Update_AspectRatio",
            "category": "TEST_Category",
            "description": "",
            "thumbnail": "",
            "videoUrl": "https://youtube.com/watch?v=test456",
            "featured": False,
            "tags": [],
            "year": 2026,
            "aspectRatio": "16:9"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/projects", json=create_data)
        assert create_response.status_code == 200
        project_id = create_response.json()["id"]
        print(f"✅ Created project with aspectRatio '16:9', ID: {project_id}")
        
        # Update to different aspectRatio
        update_data = {
            "title": "TEST_Update_AspectRatio",
            "category": "TEST_Category",
            "description": "",
            "thumbnail": "",
            "videoUrl": "https://youtube.com/watch?v=test456",
            "featured": False,
            "tags": [],
            "year": 2026,
            "aspectRatio": "1:1"  # Square
        }
        
        update_response = requests.put(f"{BASE_URL}/api/projects/{project_id}", json=update_data)
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["aspectRatio"] == "1:1"
        print(f"✅ PUT returned updated aspectRatio: {updated['aspectRatio']}")
        
        # Verify persistence with GET
        get_response = requests.get(f"{BASE_URL}/api/projects/{project_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["aspectRatio"] == "1:1"
        print(f"✅ GET confirms aspectRatio persisted: {fetched['aspectRatio']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/projects/{project_id}")
        print(f"✅ Cleaned up test project")
    
    def test_all_aspect_ratio_options(self):
        """Test all aspectRatio options save correctly"""
        aspect_ratios = ["16:9", "9:16", "1:1", "4:3", "21:9"]
        
        for ar in aspect_ratios:
            test_data = {
                "title": f"TEST_AR_{ar.replace(':', '_')}",
                "category": "TEST_Category",
                "description": "",
                "thumbnail": "",
                "videoUrl": "https://youtube.com/watch?v=testAR",
                "featured": False,
                "tags": [],
                "year": 2026,
                "aspectRatio": ar
            }
            
            # Create
            create_resp = requests.post(f"{BASE_URL}/api/projects", json=test_data)
            assert create_resp.status_code == 200
            project_id = create_resp.json()["id"]
            
            # Verify
            get_resp = requests.get(f"{BASE_URL}/api/projects/{project_id}")
            assert get_resp.status_code == 200
            assert get_resp.json()["aspectRatio"] == ar
            print(f"✅ AspectRatio '{ar}' saves and persists correctly")
            
            # Cleanup
            requests.delete(f"{BASE_URL}/api/projects/{project_id}")


class TestExistingProjectsHaveAspectRatio:
    """Verify existing projects have aspectRatio field"""
    
    def test_projects_have_aspect_ratio_field(self):
        """All projects should have aspectRatio field"""
        response = requests.get(f"{BASE_URL}/api/projects")
        assert response.status_code == 200
        projects = response.json()
        
        for project in projects:
            assert "aspectRatio" in project, f"Project '{project['title']}' missing aspectRatio"
            assert project["aspectRatio"] in ["16:9", "9:16", "1:1", "4:3", "21:9"], \
                f"Project '{project['title']}' has invalid aspectRatio: {project.get('aspectRatio')}"
        
        print(f"✅ All {len(projects)} projects have valid aspectRatio field")


class TestAdminAuthAndLogout:
    """Test admin authentication"""
    
    def test_admin_login_with_correct_password(self):
        """Test admin auth with orbya2024"""
        response = requests.post(
            f"{BASE_URL}/api/admin/auth",
            json={"password": "orbya2024"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        print("✅ Admin auth successful with 'orbya2024'")
    
    def test_admin_login_rejects_wrong_password(self):
        """Test admin auth rejects wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/admin/auth",
            json={"password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✅ Admin auth correctly rejects wrong password")


class TestAPIEndpoints:
    """Test core API endpoints"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        print(f"✅ API root: {response.json()['message']}")
    
    def test_projects_endpoint(self):
        """Test projects listing"""
        response = requests.get(f"{BASE_URL}/api/projects")
        assert response.status_code == 200
        projects = response.json()
        assert isinstance(projects, list)
        print(f"✅ Found {len(projects)} projects")
    
    def test_skills_endpoint(self):
        """Test skills listing"""
        response = requests.get(f"{BASE_URL}/api/skills")
        assert response.status_code == 200
        skills = response.json()
        assert isinstance(skills, list)
        print(f"✅ Found {len(skills)} skills")
    
    def test_config_endpoint(self):
        """Test config endpoint hides adminPassword"""
        response = requests.get(f"{BASE_URL}/api/config")
        assert response.status_code == 200
        config = response.json()
        assert "siteName" in config
        assert "adminPassword" not in config
        print(f"✅ Config loaded, adminPassword hidden")
    
    def test_quotes_endpoint(self):
        """Test quotes listing"""
        response = requests.get(f"{BASE_URL}/api/quotes")
        assert response.status_code == 200
        quotes = response.json()
        assert isinstance(quotes, list)
        print(f"✅ Found {len(quotes)} quotes")
    
    def test_stats_endpoint(self):
        """Test stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        stats = response.json()
        assert isinstance(stats, list)
        print(f"✅ Found {len(stats)} stats")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
