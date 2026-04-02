"""
Seed script to populate the database with sample data
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from database import engine, Base, get_db
from models import Employee, Department
from datetime import date

async def seed_database():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    print("✓ Tables created")
    
    # Get database session
    async for db in get_db():
        # Create departments
        departments = [
            Department(name="Engineering"),
            Department(name="Human Resources"),
            Department(name="Sales"),
            Department(name="Marketing"),
            Department(name="Finance"),
        ]
        
        db.add_all(departments)
        await db.commit()
        
        print("✓ Departments created")
        
        # Refresh to get IDs
        for dept in departments:
            await db.refresh(dept)
        
        # Create employees
        employees = [
            Employee(
                first_name="John",
                last_name="Doe",
                email="john.doe@company.com",
                phone="555-0101",
                role="Software Engineer",
                department_id=departments[0].id,
                hire_date=date(2023, 1, 15),
                salary=95000.00
            ),
            Employee(
                first_name="Jane",
                last_name="Smith",
                email="jane.smith@company.com",
                phone="555-0102",
                role="Senior Developer",
                department_id=departments[0].id,
                hire_date=date(2022, 6, 1),
                salary=110000.00
            ),
            Employee(
                first_name="Mike",
                last_name="Johnson",
                email="mike.johnson@company.com",
                phone="555-0103",
                role="HR Manager",
                department_id=departments[1].id,
                hire_date=date(2021, 3, 10),
                salary=85000.00
            ),
            Employee(
                first_name="Sarah",
                last_name="Williams",
                email="sarah.williams@company.com",
                phone="555-0104",
                role="Sales Representative",
                department_id=departments[2].id,
                hire_date=date(2023, 8, 20),
                salary=70000.00
            ),
            Employee(
                first_name="David",
                last_name="Brown",
                email="david.brown@company.com",
                phone="555-0105",
                role="Marketing Specialist",
                department_id=departments[3].id,
                hire_date=date(2022, 11, 5),
                salary=75000.00
            ),
            Employee(
                first_name="Emily",
                last_name="Davis",
                email="emily.davis@company.com",
                phone="555-0106",
                role="Financial Analyst",
                department_id=departments[4].id,
                hire_date=date(2023, 2, 14),
                salary=80000.00
            ),
            Employee(
                first_name="Robert",
                last_name="Miller",
                email="robert.miller@company.com",
                phone="555-0107",
                role="DevOps Engineer",
                department_id=departments[0].id,
                hire_date=date(2022, 9, 1),
                salary=100000.00
            ),
            Employee(
                first_name="Lisa",
                last_name="Anderson",
                email="lisa.anderson@company.com",
                phone="555-0108",
                role="Product Manager",
                department_id=departments[0].id,
                hire_date=date(2021, 7, 15),
                salary=115000.00
            ),
        ]
        
        db.add_all(employees)
        await db.commit()
        
        print("✓ Employees created")
        print(f"\n✅ Database seeded successfully!")
        print(f"   - {len(departments)} departments")
        print(f"   - {len(employees)} employees")
        
        break

if __name__ == "__main__":
    print("🌱 Seeding database...")
    asyncio.run(seed_database())
