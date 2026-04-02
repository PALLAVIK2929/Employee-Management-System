"""
Test script to verify admin login credentials
"""
import bcrypt
from auth import get_user, verify_password

# Test the admin user
username = "admin@company.com"
password = "admin123"

print(f"Testing login for: {username}")
print(f"Password: {password}")
print()

# Get user
user = get_user(None, username)

if user:
    print(f"✓ User found: {user.username}")
    print(f"  Full name: {user.full_name}")
    print(f"  Email: {user.email}")
    print(f"  Hashed password: {user.hashed_password[:50]}...")
    print()
    
    # Test password verification
    is_valid = verify_password(password, user.hashed_password)
    
    if is_valid:
        print("✅ Password verification SUCCESSFUL!")
        print("   Login should work with these credentials.")
    else:
        print("❌ Password verification FAILED!")
        print("   The password does not match.")
        
        # Generate new hash for reference
        new_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print(f"\n   New hash for '{password}': {new_hash}")
else:
    print("❌ User not found!")
    print("   The username does not exist.")
