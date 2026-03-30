from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
import models, schemas
from typing import List
from sqlalchemy.exc import IntegrityError

# Employee CRUD
async def get_employees(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Employee).offset(skip).limit(limit))
    return result.scalars().all()

async def get_employee(db: AsyncSession, employee_id: int):
    result = await db.execute(select(models.Employee).filter(models.Employee.id == employee_id))
    return result.scalar_one_or_none()

async def create_employee(db: AsyncSession, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(**employee.model_dump())
    db.add(db_employee)
    try:
        await db.commit()
        await db.refresh(db_employee)
    except IntegrityError as e:
        await db.rollback()
        raise e
    return db_employee

async def update_employee(db: AsyncSession, employee_id: int, employee: schemas.EmployeeUpdate):
    try:
        await db.execute(
            update(models.Employee)
            .where(models.Employee.id == employee_id)
            .values(**employee.model_dump(exclude_unset=True))
        )
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise e
    return await get_employee(db, employee_id)

async def delete_employee(db: AsyncSession, employee_id: int):
    await db.execute(delete(models.Employee).where(models.Employee.id == employee_id))
    await db.commit()

async def bulk_create_employees(db: AsyncSession, employees: List[schemas.EmployeeCreate]):
    db_employees = [models.Employee(**emp.model_dump()) for emp in employees]
    db.add_all(db_employees)
    await db.commit()
    return db_employees

# Department CRUD
async def get_departments(db: AsyncSession):
    result = await db.execute(select(models.Department))
    return result.scalars().all()

async def create_department(db: AsyncSession, department: schemas.DepartmentCreate):
    db_department = models.Department(**department.model_dump())
    db.add(db_department)
    await db.commit()
    await db.refresh(db_department)
    return db_department

async def update_department(db: AsyncSession, department_id: int, department: schemas.DepartmentUpdate):
    await db.execute(
        update(models.Department)
        .where(models.Department.id == department_id)
        .values(**department.model_dump(exclude_unset=True))
    )
    await db.commit()
    result = await db.execute(select(models.Department).filter(models.Department.id == department_id))
    return result.scalar_one_or_none()

async def delete_department(db: AsyncSession, department_id: int):
    # Nullify department_id for employees in this department before deleting
    await db.execute(
        update(models.Employee)
        .where(models.Employee.department_id == department_id)
        .values(department_id=None)
    )
    await db.execute(delete(models.Department).where(models.Department.id == department_id))
    await db.commit()
