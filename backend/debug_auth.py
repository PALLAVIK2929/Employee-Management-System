
import sys
import os
import bcrypt

def generate_admin_hash():
    password = b"admin123"
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    print(f"New Hash for 'admin123': {hashed.decode('utf-8')}")

    # Verify immediately
    if bcrypt.checkpw(password, hashed):
        print("Verification: SUCCESS")
    else:
        print("Verification: FAILED")

if __name__ == "__main__":
    generate_admin_hash()
