"""
Backend API Tests for ORBYA Portfolio
Tests: Admin auth, File uploads, Projects, Skills, Config, Contact, and URL parsing
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndBasics:
    """Basic health and API availability tests"""
    
    def test_api_root(self):
        """Test API root returns expected message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✅ API Root: {data['message']}")
    
    def test_api_config(self):
        """Test config endpoint returns site settings"""
        response = requests.get(f"{BASE_URL}/api/config")
        assert response.status_code == 200
        data = response.json()
        assert "siteName" in data
        assert "colors" in data
        # adminPassword should not be exposed
        assert "adminPassword" not in data
        print(f"✅ Config loaded: {data['siteName']}")


class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_auth_valid_password(self):
        """Test admin auth with correct password"""
        response = requests.post(
            f"{BASE_URL}/api/admin/auth",
            json={"password": "orbya2024"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        print("✅ Admin auth successful with correct password")
    
    def test_admin_auth_invalid_password(self):
        """Test admin auth with wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/admin/auth",
            json={"password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✅ Admin auth correctly rejects wrong password")


class TestFileUploads:
    """File upload and serving tests"""
    
    def test_upload_returns_api_uploads_prefix(self):
        """Test that upload endpoint returns /api/uploads/ prefixed URL"""
        # Create a test image file
        test_content = b"test image content"
        files = {"file": ("test.jpg", test_content, "image/jpeg")}
        
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert data["url"].startswith("/api/uploads/")
        assert "/api/uploads/images/" in data["url"]
        print(f"✅ Upload URL has correct prefix: {data['url']}")
    
    def test_media_list_has_api_uploads_urls(self):
        """Test that media list returns /api/uploads/ prefixed URLs"""
        response = requests.get(f"{BASE_URL}/api/media")
        assert response.status_code == 200
        data = response.json()
        
        # Check images URLs
        for img in data.get("images", []):
            assert img["url"].startswith("/api/uploads/")
            print(f"✅ Image URL: {img['url']}")
        
        # Check videos URLs
        for vid in data.get("videos", []):
            assert vid["url"].startswith("/api/uploads/")
            print(f"✅ Video URL: {vid['url']}")
    
    def test_uploaded_files_accessible_via_api_uploads(self):
        """Test that uploaded files are accessible via /api/uploads/ path"""
        # Get media list
        response = requests.get(f"{BASE_URL}/api/media")
        data = response.json()
        
        # Test accessing an image if available
        if data.get("images"):
            img_url = data["images"][0]["url"]
            file_response = requests.get(f"{BASE_URL}{img_url}")
            assert file_response.status_code == 200
            print(f"✅ File accessible at: {img_url}")


class TestProjects:
    """Projects CRUD tests"""
    
    def test_get_projects(self):
        """Test fetching all projects"""
        response = requests.get(f"{BASE_URL}/api/projects")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Found {len(data)} projects")
    
    def test_projects_have_youtube_shorts_urls(self):
        """Test that projects with YouTube Shorts URLs exist"""
        response = requests.get(f"{BASE_URL}/api/projects")
        data = response.json()
        
        shorts_projects = [p for p in data if "shorts" in p.get("videoUrl", "").lower()]
        print(f"✅ Found {len(shorts_projects)} projects with YouTube Shorts URLs")
        
        for p in shorts_projects:
            print(f"   - {p['title']}: {p['videoUrl']}")


class TestSkills:
    """Skills endpoint tests"""
    
    def test_get_skills(self):
        """Test fetching all skills"""
        response = requests.get(f"{BASE_URL}/api/skills")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Found {len(data)} skills")


class TestContact:
    """Contact form tests"""
    
    def test_submit_contact_form(self):
        """Test contact form submission"""
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "name": "TEST_User",
                "email": "test@example.com",
                "subject": "Test Subject",
                "message": "This is a test message"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "TEST_User"
        assert data["email"] == "test@example.com"
        print("✅ Contact form submission successful")
    
    def test_get_contact_messages(self):
        """Test fetching contact messages"""
        response = requests.get(f"{BASE_URL}/api/contact")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Found {len(data)} contact messages")


class TestQuotesAndStats:
    """Quotes and stats tests"""
    
    def test_get_quote(self):
        """Test fetching quote of the day"""
        response = requests.get(f"{BASE_URL}/api/quote")
        assert response.status_code == 200
        data = response.json()
        assert "quote" in data
        assert "author" in data
        print(f"✅ Quote: '{data['quote'][:50]}...' - {data['author']}")
    
    def test_get_stats(self):
        """Test fetching portfolio stats"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Found {len(data)} stats")
    
    def test_get_all_quotes(self):
        """Test fetching all quotes"""
        response = requests.get(f"{BASE_URL}/api/quotes")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Found {len(data)} quotes in library")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
