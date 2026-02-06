#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class PortfolioAPITester:
    def __init__(self, base_url="https://hudstyled-folio.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if details:
            print(f"    Details: {details}")

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Message: {data.get('message', 'N/A')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:100]}"
                
            self.log_result("API Root Endpoint", success, details)
            return success
            
        except Exception as e:
            self.log_result("API Root Endpoint", False, f"Error: {str(e)}")
            return False

    def test_contact_form_submission(self):
        """Test contact form submission"""
        try:
            contact_data = {
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Test Subject",
                "message": "This is a test message from automated testing."
            }
            
            response = requests.post(
                f"{self.base_url}/api/contact",
                json=contact_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Contact ID: {data.get('id', 'N/A')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
                
            self.log_result("Contact Form Submission", success, details)
            return success
            
        except Exception as e:
            self.log_result("Contact Form Submission", False, f"Error: {str(e)}")
            return False

    def test_contact_form_validation(self):
        """Test contact form validation with invalid data"""
        try:
            # Test with invalid email
            invalid_data = {
                "name": "Test User",
                "email": "invalid-email",
                "subject": "Test Subject",
                "message": "Test message"
            }
            
            response = requests.post(
                f"{self.base_url}/api/contact",
                json=invalid_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            # Should return 422 for validation error
            success = response.status_code == 422
            details = f"Status: {response.status_code} (Expected 422 for invalid email)"
                
            self.log_result("Contact Form Validation", success, details)
            return success
            
        except Exception as e:
            self.log_result("Contact Form Validation", False, f"Error: {str(e)}")
            return False

    def test_get_contact_messages(self):
        """Test retrieving contact messages"""
        try:
            response = requests.get(f"{self.base_url}/api/contact", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {response.status_code}, Messages count: {len(data)}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:100]}"
                
            self.log_result("Get Contact Messages", success, details)
            return success
            
        except Exception as e:
            self.log_result("Get Contact Messages", False, f"Error: {str(e)}")
            return False

    def test_resume_download(self):
        """Test resume download endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/resume/download", timeout=10)
            
            # Could be 200 (file exists) or 404 (file not found)
            success = response.status_code in [200, 404]
            
            if response.status_code == 200:
                details = f"Status: {response.status_code}, Content-Type: {response.headers.get('content-type', 'N/A')}"
            elif response.status_code == 404:
                details = f"Status: {response.status_code}, Resume file not found (expected for test environment)"
            else:
                details = f"Status: {response.status_code}, Unexpected response"
                
            self.log_result("Resume Download Endpoint", success, details)
            return success
            
        except Exception as e:
            self.log_result("Resume Download Endpoint", False, f"Error: {str(e)}")
            return False

    def test_status_endpoints(self):
        """Test status check endpoints"""
        try:
            # Test creating a status check
            status_data = {
                "client_name": "test_client"
            }
            
            response = requests.post(
                f"{self.base_url}/api/status",
                json=status_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            create_success = response.status_code == 200
            
            if create_success:
                # Test getting status checks
                get_response = requests.get(f"{self.base_url}/api/status", timeout=10)
                get_success = get_response.status_code == 200
                
                success = create_success and get_success
                details = f"Create: {response.status_code}, Get: {get_response.status_code}"
            else:
                success = False
                details = f"Create failed: {response.status_code}, Response: {response.text[:100]}"
                
            self.log_result("Status Check Endpoints", success, details)
            return success
            
        except Exception as e:
            self.log_result("Status Check Endpoints", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting ORBYA Portfolio Backend API Tests")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Run all tests
        tests = [
            self.test_api_root,
            self.test_contact_form_submission,
            self.test_contact_form_validation,
            self.test_get_contact_messages,
            self.test_resume_download,
            self.test_status_endpoints
        ]
        
        for test in tests:
            test()
            print()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return True
        else:
            print("⚠️  Some backend tests failed")
            return False

    def get_results(self):
        """Get detailed test results"""
        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "success_rate": (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0,
            "results": self.results
        }

def main():
    tester = PortfolioAPITester()
    success = tester.run_all_tests()
    
    # Save results to file
    results = tester.get_results()
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())