from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import crud, schemas, database

router = APIRouter(prefix="/departments", tags=["departments"])

@router.post("/", response_model=schemas.Department)
async def create_department(department: schemas.DepartmentCreate, db: AsyncSession = Depends(database.get_db)):
    return await crud.create_department(db=db, department=department)

@router.get("/", response_model=List[schemas.Department])
async def read_departments(db: AsyncSession = Depends(database.get_db)):
    return await crud.get_departments(db)

@router.put("/{department_id}", response_model=schemas.Department)
async def update_department(department_id: int, department: schemas.DepartmentUpdate, db: AsyncSession = Depends(database.get_db)):
    db_dept = await crud.update_department(db, department_id=department_id, department=department)
    if db_dept is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_dept

@router.delete("/{department_id}")
async def delete_department(department_id: int, db: AsyncSession = Depends(database.get_db)):
    await crud.delete_department(db, department_id=department_id)
    return {"message": "Department deleted"}
