#!/usr/bin/env python
"""Quick test script to verify backend and frontend are working."""
import time
import requests
import sys

def test_backend():
    """Test if backend is running."""
    print("Testing backend server...")
    try:
        # Wait a bit for server to start
        time.sleep(2)
        response = requests.get("http://127.0.0.1:8000/api/dashboard/", timeout=5)
        if response.status_code == 200:
            print("✓ Backend is running successfully!")
            print(f"  Status Code: {response.status_code}")
            data = response.json()
            print(f"  Dashboard data: {data}")
            return True
        else:
            print(f"✗ Backend returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Backend is not running or not accessible on port 8000")
        print("  Make sure to run: python manage.py runserver 8000")
        return False
    except Exception as e:
        print(f"✗ Backend test failed: {e}")
        return False

def test_frontend():
    """Test if frontend is running."""
    print("\nTesting frontend server...")
    try:
        time.sleep(1)
        response = requests.get("http://127.0.0.1:5173/", timeout=5)
        if response.status_code == 200:
            print("✓ Frontend is running successfully!")
            print(f"  Status Code: {response.status_code}")
            print(f"  URL: http://127.0.0.1:5173/")
            return True
        else:
            print(f"✗ Frontend returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Frontend is not running or not accessible on port 5173")
        print("  Make sure to run: cd frontend && npm run dev")
        return False
    except Exception as e:
        print(f"✗ Frontend test failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Testing County Platform Servers")
    print("=" * 50)
    
    backend_ok = test_backend()
    frontend_ok = test_frontend()
    
    print("\n" + "=" * 50)
    if backend_ok and frontend_ok:
        print("✓ All servers are running!")
        print("\nYou can now access:")
        print("  Backend API: http://127.0.0.1:8000/api/")
        print("  Frontend: http://127.0.0.1:5173/")
        sys.exit(0)
    else:
        print("✗ Some servers are not running")
        print("\nTo start the servers:")
        print("  1. Backend: python manage.py runserver 8000")
        print("  2. Frontend: cd frontend && npm run dev")
        sys.exit(1)


