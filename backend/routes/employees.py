from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import crud, schemas, database

router = APIRouter(prefix="/employees", tags=["employees"])

@router.post("/", response_model=schemas.Employee)
async def create_employee(employee: schemas.EmployeeCreate, db: AsyncSession = Depends(database.get_db)):
    try:
        return await crud.create_employee(db=db, employee=employee)
    except crud.IntegrityError:
        raise HTTPException(status_code=400, detail="An employee with this email already exists.")

@router.get("/", response_model=List[schemas.Employee])
async def read_employees(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(database.get_db)):
    return await crud.get_employees(db, skip=skip, limit=limit)

@router.get("/{employee_id}", response_model=schemas.Employee)
async def read_employee(employee_id: int, db: AsyncSession = Depends(database.get_db)):
    db_employee = await crud.get_employee(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@router.put("/{employee_id}", response_model=schemas.Employee)
async def update_employee(employee_id: int, employee: schemas.EmployeeUpdate, db: AsyncSession = Depends(database.get_db)):
    db_employee = await crud.update_employee(db, employee_id=employee_id, employee=employee)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@router.delete("/{employee_id}")
async def delete_employee(employee_id: int, db: AsyncSession = Depends(database.get_db)):
    await crud.delete_employee(db, employee_id=employee_id)
    return {"message": "Employee deleted"}

@router.post("/bulk", response_model=List[schemas.Employee])
async def bulk_create_employees(bulk_data: schemas.BulkEmployeeCreate, db: AsyncSession = Depends(database.get_db)):
    return await crud.bulk_create_employees(db, employees=bulk_data.employees)
