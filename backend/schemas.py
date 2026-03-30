from pydantic import BaseModel, EmailStr
from typing import Optional, List

# Department Schemas
class DepartmentBase(BaseModel):
    name: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: int

    class Config:
        from_attributes = True

# Employee Schemas
class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role: Optional[str] = None
    department_id: Optional[int] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    department_id: Optional[int] = None

class Employee(EmployeeBase):
    id: int

    class Config:
        from_attributes = True

class BulkEmployeeCreate(BaseModel):
    employees: List[EmployeeCreate]
